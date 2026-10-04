import { getUserProfile } from "@/lib/profile";
import { getDonorProfile } from "@/lib/donor";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getAvailabilityState } from "@/lib/availability";

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  const donorId = new URL(request.url).searchParams.get("donorId");
  if (!donorId || donorId.length > 256) {
    return NextResponse.json({ error: "Invalid donor." }, { status: 400, headers: privateHeaders });
  }

  const [profile, donor] = await Promise.all([
    getUserProfile(donorId),
    getDonorProfile(donorId),
  ]);
  if (profile.isDonor !== true && !donor) {
    return NextResponse.json({ error: "Donor not found." }, { status: 404, headers: privateHeaders });
  }

  const availability = getAvailabilityState(
    typeof profile.availability === "string" ? profile.availability : "Unavailable",
    typeof profile.availableFrom === "string" ? profile.availableFrom : null,
    new Date(),
    profile.updatedAt,
  );
  if (!availability.available) {
    return NextResponse.json(
      { error: "This donor is not currently available for contact." },
      { status: 403, headers: privateHeaders },
    );
  }

  const phone = typeof profile.phone === "string" ? profile.phone.trim() : "";
  const whatsapp = typeof profile.whatsapp === "string" ? profile.whatsapp.trim() : "";
  if (!phone && !whatsapp) {
    return NextResponse.json({ error: "Contact information not available." }, { status: 404, headers: privateHeaders });
  }

  return NextResponse.json({ phone, whatsapp }, { headers: privateHeaders });
}
