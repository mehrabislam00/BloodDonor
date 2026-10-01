import { auth } from "@/lib/auth";
import { hasCredentialPassword } from "@/lib/account-security";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "Please sign in again." }, { status: 401 });
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST", message: "Invalid request." }, { status: 400 });
  }

  const requiresPassword = await hasCredentialPassword(session.user.id);
  const password = typeof body.password === "string" ? body.password : "";
  if (requiresPassword && !password.trim()) {
    return NextResponse.json(
      { code: "PASSWORD_REQUIRED", message: "Enter your password to delete this account." },
      { status: 400 },
    );
  }

  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.set("content-type", "application/json");

  return auth.handler(new Request(new URL("/api/auth/delete-user", request.url), {
    method: "POST",
    headers,
    body: JSON.stringify(requiresPassword ? { password } : {}),
  }));
}
