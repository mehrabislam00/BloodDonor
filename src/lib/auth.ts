import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database, mongoClient } from "./mongodb";
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
  database: mongodbAdapter(database, {
    client: mongoClient,
  }),
});