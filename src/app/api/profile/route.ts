import { auth } from "@/lib/auth";
import {
  getUserProfile,
  profileFields,
  updateUserProfile,
  getProfileCompletion,
  type ProfileFields,
} from "@/lib/profile";
import {
  createAvailabilityRecord,
  getAvailabilityState,
  normalizeAvailability,
} from "@/lib/availability";
import { getDonorProfile, updateDonorProfile } from "@/lib/donor";
import { normalizeDonationDate } from "@/lib/donation-date";
import { NextResponse } from "next/server";

async function getSession(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function GET(request: Request) {
  const session = await getSession(request);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile, donor] = await Promise.all([
    getUserProfile(session.user.id),
    getDonorProfile(session.user.id),
  ]);
  return NextResponse.json({
    profile: {
      ...profile,
      lastDonationDate: typeof profile.lastDonationDate === "string" && profile.lastDonationDate !== ""
        ? profile.lastDonationDate
        : donor?.lastDonationDate || "",
    },
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

  if (Object.hasOwn(body, "lastDonationDate")) {
    const lastDonationDate = normalizeDonationDate(body.lastDonationDate);
    if (lastDonationDate === null) {
      return NextResponse.json({ error: "Invalid last donation date." }, { status: 400 });
    }
    updates.lastDonationDate = lastDonationDate;
  }

  const currentProfile = await getUserProfile(session.user.id);
  if (typeof updates.availability === "string" && updates.availability.trim()) {
    const requested = createAvailabilityRecord(updates.availability);
    if (!requested) {
      return NextResponse.json({ error: "Invalid donor availability." }, { status: 400 });
    }

    const currentAvailability = typeof currentProfile.availability === "string"
      ? normalizeAvailability(currentProfile.availability)
      : null;
    const currentDate = getAvailabilityState(
      typeof currentProfile.availability === "string" ? currentProfile.availability : "Unavailable",
      typeof currentProfile.availableFrom === "string" ? currentProfile.availableFrom : null,
      new Date(),
      currentProfile.updatedAt,
    ).availableFrom;
    updates.availability = requested.availability;
    updates.availableFrom = currentAvailability === requested.availability && currentDate
      ? currentDate
      : requested.availableFrom;
  } else if (updates.isDonor === true) {
    return NextResponse.json({ error: "Donor availability is required." }, { status: 400 });
  }

  if (typeof body.fullName === "string" && body.fullName.trim()) {
    await auth.api.updateUser({
      headers: request.headers,
      body: { name: body.fullName.trim() },
    });
  }

  await updateUserProfile(session.user.id, updates);
  const donor = (updates.isDonor === true || currentProfile.isDonor === true)
    && typeof updates.lastDonationDate === "string"
    ? await updateDonorProfile(session.user.id, { lastDonationDate: updates.lastDonationDate })
    : null;
  const persistedDonationDate = donor?.lastDonationDate
    ?? updates.lastDonationDate
    ?? currentProfile.lastDonationDate;

  return NextResponse.json({
    profile: { ...currentProfile, ...updates, lastDonationDate: persistedDonationDate },
    user: {
      name: typeof body.fullName === "string" ? body.fullName.trim() : session.user.name,
      email: session.user.email,
    },
  });
}
