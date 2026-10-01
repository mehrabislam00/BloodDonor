import { auth } from "@/lib/auth";
import { getUserProfile, updateUserProfile } from "@/lib/profile";
import { getDonorProfile, updateDonorProfile } from "@/lib/donor";
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
      fullName: session.user.name || "",
      email: session.user.email || "",
      isDonor: profile.isDonor === true,
      lastDonationDate: donor?.lastDonationDate || profile.lastDonationDate || "",
    },
  });
}

export async function POST(request: Request) {
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

  const profile = await getUserProfile(session.user.id);
  const phone = typeof body.phone === "string" ? body.phone.trim() : typeof profile.phone === "string" ? profile.phone : "";
  const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : typeof profile.whatsapp === "string" ? profile.whatsapp : "";
  const area = typeof body.area === "string" ? body.area.trim() : typeof profile.area === "string" ? profile.area : "";
  const bloodGroup = typeof body.bloodGroup === "string" ? body.bloodGroup.trim() : typeof profile.bloodGroup === "string" ? profile.bloodGroup : "";
  const availability = typeof body.availability === "string" ? body.availability.trim() : typeof profile.availability === "string" ? profile.availability : "";
  const lastDonationDate = typeof body.lastDonationDate === "string" ? body.lastDonationDate.trim() : "";

  if (!phone || !bloodGroup || !area || !availability) {
    return NextResponse.json(
      { error: "Phone, blood group, area, and availability are required." },
      { status: 400 },
    );
  }

  if (bloodGroup.length > 4 || lastDonationDate.length > 10) {
    return NextResponse.json({ error: "Invalid donor information." }, { status: 400 });
  }

  await updateUserProfile(session.user.id, {
    phone,
    whatsapp,
    area,
    bloodGroup,
    availability,
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
      availability,
      lastDonationDate,
      isDonor: true,
      fullName: session.user.name || "",
      email: session.user.email || "",
    },
  });
}