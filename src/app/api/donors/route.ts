import { getPublicDonorCards } from "@/lib/public-donors";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const activity = searchParams.get("activity");
  const availability = searchParams.get("availability")?.slice(0, 40) ?? "";
  const donors = await getPublicDonorCards({
    bloodGroup: searchParams.get("bloodGroup")?.slice(0, 4) ?? "",
    area: searchParams.get("area")?.slice(0, 100) ?? "",
    activity: activity === "now" || activity === "recent" ? activity : "all",
    availability,
  });
  return NextResponse.json(
    { donors },
    { headers: { "Cache-Control": "no-store" } },
  );
}
