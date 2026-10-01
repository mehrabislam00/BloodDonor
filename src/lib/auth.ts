import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.BETTER_AUTH_DB_URL;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

const client = new MongoClient(mongoUri);
const db = client.db(`better_auth_db_blood_donor`);
const googleClientId =
  process.env.BETTER_AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET ||
  process.env.BETTER_AUTH_GOOGLE_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET;

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
  },
  database: mongodbAdapter(db, {
    client,
  }),
});