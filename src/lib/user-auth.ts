import { auth } from "@/lib/auth";
import { isAccountBlocked } from "@/lib/admin/store";

export const blockedAccountResponse = {
  error: "Your account is currently restricted.",
  code: "ACCOUNT_BLOCKED",
} as const;

export async function getUserAccess(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const blocked = Boolean(session?.user && await isAccountBlocked(session.user.id));
  return { session, blocked };
}
