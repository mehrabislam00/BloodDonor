import { auth } from "@/lib/auth";
import { hasCredentialPassword } from "@/lib/account-security";
import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { database } from "@/lib/mongodb";
import { isAccountBlocked } from "@/lib/admin/store";

const authHandler = toNextJsHandler(auth);

export async function GET(request: Request) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (session?.user?.id && await isAccountBlocked(session.user.id)) {
		return NextResponse.json({ error: "Your account is currently restricted.", code: "ACCOUNT_BLOCKED" }, { status: 403 });
	}
	return authHandler.GET(request);
}

export async function POST(request: Request) {
	if (new URL(request.url).pathname.endsWith("/sign-in/email")) {
		const body = await request.clone().json().catch(() => null) as { email?: unknown } | null;
		const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
		if (email) {
			const user = await database.collection<{ id: string }>("user").findOne(
				{ email },
				{ projection: { id: 1 } },
			);
			if (user) {
				const blocked = await database.collection("adminBans").findOne({ userId: user.id, active: true });
				const deleted = await database.collection("adminDeletedUsers").findOne({ userId: user.id });
				if (blocked || deleted) {
					return NextResponse.json(
						{ code: "ACCOUNT_RESTRICTED", message: "This account is restricted. Please contact support." },
						{ status: 403 },
					);
				}
			}
		}
	}
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