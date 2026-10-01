import { auth } from "@/lib/auth";
import { hasCredentialPassword } from "@/lib/account-security";
import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

const authHandler = toNextJsHandler(auth);

export const GET = authHandler.GET;

export async function POST(request: Request) {
	if (new URL(request.url).pathname !== "/api/auth/delete-user") {
		return authHandler.POST(request);
	}

	const session = await auth.api.getSession({ headers: request.headers });
	if (session?.user?.id) {
		const body = await request.clone().json().catch(() => null) as { password?: unknown } | null;
		const password = typeof body?.password === "string" ? body.password : "";
		if (await hasCredentialPassword(session.user.id) && !password.trim()) {
			return NextResponse.json(
				{ code: "PASSWORD_REQUIRED", message: "Enter your password to delete this account." },
				{ status: 400 },
			);
		}
	}

	return authHandler.POST(request);
}