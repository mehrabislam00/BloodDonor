import { getAdminSession } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  return NextResponse.json({ authorized: true });
}
