import { hasCredentialPassword } from "@/lib/account-security";
import { blockedAccountResponse, getUserAccess } from "@/lib/user-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { session, blocked } = await getUserAccess(request);

  if (!session?.user?.id || blocked) {
    return NextResponse.json(blocked ? blockedAccountResponse : { hasPassword: false }, { status: blocked ? 403 : 401 });
  }

  const hasPassword = await hasCredentialPassword(session.user.id);

  return NextResponse.json({ hasPassword });
}
