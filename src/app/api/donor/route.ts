import { blockedAccountResponse, getUserAccess } from "@/lib/user-auth";
import { getUserProfile, updateUserProfile } from "@/lib/profile";
import { getDonorProfile, updateDonorProfile } from "@/lib/donor";
import {
  createAvailabilityRecord,
  getAvailabilityState,
  normalizeAvailability,
} from "@/lib/availability";
import { normalizeDonationDate } from "@/lib/donation-date";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { session, blocked } = await getUserAccess(request);

  if (!session?.user || blocked) {
    return NextResponse.json(blocked ? blockedAccountResponse : { error: "Unauthorized" }, { status: blocked ? 403 : 401 });
  }

  const [profile, donor] = await Promise.all([
    getUserProfile(session.user.id),
    getDonorProfile(session.user.id),
  ]);

  return NextResponse.json({
    profile: {
      ...profile,
      fullName: session.user.name || "",
      email: session.user.email || "",
      isDonor: profile.isDonor === true,
      lastDonationDate: typeof profile.lastDonationDate === "string" && profile.lastDonationDate !== ""
        ? profile.lastDonationDate
        : donor?.lastDonationDate || "",
    },
  });
}

export async function POST(request: Request) {
  const { session, blocked } = await getUserAccess(request);

  if (!session?.user || blocked) {
    return NextResponse.json(blocked ? blockedAccountResponse : { error: "Unauthorized" }, { status: blocked ? 403 : 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const [profile, existingDonor] = await Promise.all([
    getUserProfile(session.user.id),
    getDonorProfile(session.user.id),
  ]);
  const phone = typeof body.phone === "string" ? body.phone.trim() : typeof profile.phone === "string" ? profile.phone : "";
  const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : typeof profile.whatsapp === "string" ? profile.whatsapp : "";
  const area = typeof body.area === "string" ? body.area.trim() : typeof profile.area === "string" ? profile.area : "";
  const bloodGroup = typeof body.bloodGroup === "string" ? body.bloodGroup.trim() : typeof profile.bloodGroup === "string" ? profile.bloodGroup : "";
  const availability = typeof body.availability === "string" ? body.availability.trim() : typeof profile.availability === "string" ? profile.availability : "";
  const lastDonationDate = Object.hasOwn(body, "lastDonationDate")
    ? typeof body.lastDonationDate === "string"
      ? normalizeDonationDate(body.lastDonationDate.trim())
      : null
    : typeof profile.lastDonationDate === "string" && profile.lastDonationDate !== ""
      ? profile.lastDonationDate
      : existingDonor?.lastDonationDate || "";

  if (!phone || !bloodGroup || !area || !availability) {
    return NextResponse.json(
      { error: "Phone, blood group, area, and availability are required." },
      { status: 400 },
    );
  }

  if (lastDonationDate === null || bloodGroup.length > 4 || lastDonationDate.length > 10) {
    return NextResponse.json({ error: "Invalid donor information." }, { status: 400 });
  }

  const requestedAvailability = createAvailabilityRecord(availability);
  if (!requestedAvailability) {
    return NextResponse.json({ error: "Invalid donor availability." }, { status: 400 });
  }
  const currentAvailability = typeof profile.availability === "string"
    ? normalizeAvailability(profile.availability)
    : null;
  const currentAvailableFrom = getAvailabilityState(
    typeof profile.availability === "string" ? profile.availability : "Unavailable",
    typeof profile.availableFrom === "string" ? profile.availableFrom : null,
    new Date(),
    profile.updatedAt,
  ).availableFrom;
  const availabilityRecord = {
    availability: requestedAvailability.availability,
    availableFrom: currentAvailability === requestedAvailability.availability && currentAvailableFrom
      ? currentAvailableFrom
      : requestedAvailability.availableFrom,
  };

  await updateUserProfile(session.user.id, {
    phone,
    whatsapp,
    area,
    bloodGroup,
    ...availabilityRecord,
    lastDonationDate,
    isDonor: true,
  });

  const donor = await updateDonorProfile(session.user.id, { lastDonationDate });

  return NextResponse.json({
    donor,
    profile: {
      ...profile,
      phone,
      whatsapp,
      area,
      bloodGroup,
      availability: availabilityRecord.availability,
      availableFrom: availabilityRecord.availableFrom,
      lastDonationDate: donor?.lastDonationDate ?? lastDonationDate,
      isDonor: true,
      fullName: session.user.name || "",
      email: session.user.email || "",
    },
  });
}