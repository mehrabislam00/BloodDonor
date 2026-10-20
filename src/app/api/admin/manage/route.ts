import { getAdminSession } from "@/lib/admin-auth";
import { deleteReport, setDonorBan, softDeleteUser, writeAdminAudit } from "@/lib/admin/store";
import { updateUserProfile } from "@/lib/profile";
import { database } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await request.json().catch(() => null) as {
    action?: unknown;
    userId?: unknown;
    reason?: unknown;
    reportId?: unknown;
    availability?: unknown;
    status?: unknown;
  } | null;
  const action = body?.action;
  const userId = typeof body?.userId === "string" ? body.userId.trim() : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 500) : "";
  const reportId = typeof body?.reportId === "string" ? body.reportId.trim() : "";
  const availability = body?.availability === "Available" || body?.availability === "Unavailable"
    ? body.availability
    : null;

  if (action === "delete-report") {
    if (!reportId) return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    const deleted = await deleteReport(reportId, session.user.id);
    return NextResponse.json({ success: deleted });
  }

  if (action === "update-report-status") {
    const allowedStatuses = ["Pending", "Reviewed", "Resolved", "Dismissed"];
    if (!reportId || !ObjectId.isValid(reportId) || typeof body?.status !== "string" || !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid report status update." }, { status: 400 });
    }
    const result = await database.collection("donorReports").updateOne(
      { _id: new ObjectId(reportId) },
      { $set: { status: body.status, updatedAt: new Date() } },
    );
    if (result.matchedCount === 0) return NextResponse.json({ error: "Report not found." }, { status: 404 });
    await writeAdminAudit("report.status_updated", session.user.id, null, { reportId, status: body.status });
    return NextResponse.json({ success: true });
  }

  if (action === "update-donor-availability") {
    if (!userId || !availability) return NextResponse.json({ error: "A valid availability is required." }, { status: 400 });
    const donor = await database.collection("donorProfiles").findOne({ userId }, { projection: { userId: 1 } });
    if (!donor) return NextResponse.json({ error: "Donor profile not found." }, { status: 404 });
    await updateUserProfile(userId, { availability, availableFrom: null });
    await writeAdminAudit("donor.availability_updated", session.user.id, userId, { availability });
    return NextResponse.json({ success: true });
  }

  if (!userId || !["delete-user", "ban-donor", "unban-donor", "ban-user", "unban-user"].includes(String(action))) {
    return NextResponse.json({ error: "Invalid admin action." }, { status: 400 });
  }
  if (userId === session.user.id && action === "delete-user") {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  if (action === "delete-user") {
    const target = await database.collection<{ role?: string; isAdmin?: boolean }>("user").findOne(
      { $or: [{ id: userId }, ...(ObjectId.isValid(userId) ? [{ _id: new ObjectId(userId) }] : [])] },
      { projection: { role: 1, isAdmin: 1 } },
    );
    if (target?.role === "admin" || target?.isAdmin === true) {
      return NextResponse.json({ error: "Administrator accounts cannot be deleted here." }, { status: 403 });
    }
    const deleted = await softDeleteUser(userId, session.user.id);
    return NextResponse.json({ success: deleted });
  }

  if ((action === "ban-user" || action === "ban-donor") && !reason) {
    return NextResponse.json({ error: "A ban reason is required." }, { status: 400 });
  }
  await setDonorBan(userId, session.user.id, reason || "Admin moderation action", action === "ban-donor" || action === "ban-user");
  return NextResponse.json({ success: true });
}
