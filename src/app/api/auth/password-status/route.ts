import { auth } from "@/lib/auth";
import { hasCredentialPassword } from "@/lib/account-security";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ hasPassword: false }, { status: 401 });
  }

  const hasPassword = await hasCredentialPassword(session.user.id);

  return NextResponse.json({ hasPassword });
}
