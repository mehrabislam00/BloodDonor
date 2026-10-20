import { getAdminSession } from "@/lib/admin-auth";
import { deleteReport, setDonorBan, softDeleteUser } from "@/lib/admin/store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await request.json().catch(() => null) as {
    action?: unknown;
    userId?: unknown;
    reason?: unknown;
    reportId?: unknown;
  } | null;
  const action = body?.action;
  const userId = typeof body?.userId === "string" ? body.userId.trim() : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 500) : "";
  const reportId = typeof body?.reportId === "string" ? body.reportId.trim() : "";

  if (action === "delete-report") {
    if (!reportId) return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    const deleted = await deleteReport(reportId, session.user.id);
    return NextResponse.json({ success: deleted });
  }

  if (!userId || !["delete-user", "ban-donor", "unban-donor"].includes(String(action))) {
    return NextResponse.json({ error: "Invalid admin action." }, { status: 400 });
  }
  if (userId === session.user.id && action === "delete-user") {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  if (action === "delete-user") {
    const deleted = await softDeleteUser(userId, session.user.id);
    return NextResponse.json({ success: deleted });
  }

  await setDonorBan(userId, session.user.id, reason || "Admin moderation action", action === "ban-donor");
  return NextResponse.json({ success: true });
}
