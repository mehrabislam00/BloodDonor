import { getAdminSession } from "@/lib/admin-auth";
import { getAdminData } from "@/lib/admin/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (!(await getAdminSession(request))) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const resource = new URL(request.url).searchParams.get("resource") ?? "dashboard";
  try {
    return NextResponse.json(await getAdminData(resource), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "Unknown admin resource") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to load admin data." }, { status: 500 });
  }
}
