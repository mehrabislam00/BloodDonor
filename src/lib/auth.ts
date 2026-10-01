import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database, mongoClient } from "./mongodb";

const googleClientId =
  process.env.BETTER_AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET ||
  process.env.BETTER_AUTH_GOOGLE_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET;

const deletedUsers = database.collection("deletedUsers");
const deletedDonors = database.collection("deletedDonors");
const authUsers = database.collection("user");
const profileUsers = database.collection("userProfiles");
const donorUsers = database.collection("donorProfiles");

async function archiveDeletedUser(user: { id: string; email?: string; name?: string; image?: string | null }) {
  const [authUser, profile, donor] = await Promise.all([
    authUsers.findOne({ id: user.id }),
    profileUsers.findOne({ userId: user.id }),
    donorUsers.findOne({ userId: user.id }),
  ]);

  const archiveDocument = {
    userId: user.id,
    email: authUser?.email ?? user.email ?? null,
    name: authUser?.name ?? user.name ?? null,
    image: authUser?.image ?? user.image ?? null,
    deletedAt: new Date(),
    reason: "user_requested_account_deletion",
    originalUser: authUser ?? null,
    profile: profile ?? null,
    donor: donor ?? null,
  };

  await deletedUsers.insertOne(archiveDocument);

  if (donor) {
    await deletedDonors.insertOne({
      ...archiveDocument,
      donorSnapshot: donor,
      archivedAt: new Date(),
      reason: "donor_profile_deleted_with_user",
    });
  }
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await archiveDeletedUser(user);
      },
    },
  },
  database: mongodbAdapter(database, {
    client: mongoClient,
  }),
});