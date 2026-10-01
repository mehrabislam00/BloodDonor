import { auth } from "@/lib/auth";
import {
  getUserProfile,
  profileFields,
  updateUserProfile,
  getProfileCompletion,
  type ProfileFields,
} from "@/lib/profile";
import { NextResponse } from "next/server";

async function getSession(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function GET(request: Request) {
  const session = await getSession(request);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);
  return NextResponse.json({
    profile,
    profileCompletion: getProfileCompletion(profile, session.user.name || "", session.user.email || ""),
  });
}

export async function PATCH(request: Request) {
  const session = await getSession(request);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: ProfileFields = {};
  for (const field of profileFields) {
    const value = body[field];
    if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      value === null
    ) {
      updates[field] = value;
    }
  }

  if (typeof updates.bloodGroup === "string" && updates.bloodGroup.length > 4) {
    return NextResponse.json({ error: "Invalid blood group" }, { status: 400 });
  }

  if (typeof body.fullName === "string" && body.fullName.trim()) {
    await auth.api.updateUser({
      headers: request.headers,
      body: { name: body.fullName.trim() },
    });
  }

  const profile = await updateUserProfile(session.user.id, updates);
  return NextResponse.json({
    profile,
    user: {
      name: typeof body.fullName === "string" ? body.fullName.trim() : session.user.name,
      email: session.user.email,
    },
  });
}
