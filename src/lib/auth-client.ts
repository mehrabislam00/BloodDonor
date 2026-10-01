import { createAuthClient } from "better-auth/react";

const baseURL =
  typeof window !== "undefined" ? window.location.origin : undefined;

export const authClient = createAuthClient({
  baseURL,
});

export type AuthSession = NonNullable<ReturnType<typeof authClient.useSession>["data"]>;

export const {
  signIn,
  signUp,
  signOut,
  updateUser,
  changePassword,
  deleteUser,
  useSession,
} = authClient;