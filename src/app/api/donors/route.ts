import { getPublicDonorCards } from "@/lib/public-donors";
import { NextResponse } from "next/server";

export async function GET() {
  const donors = await getPublicDonorCards();
  return NextResponse.json(
    { donors },
    { headers: { "Cache-Control": "no-store" } },
  );
}
