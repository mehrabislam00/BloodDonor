import { getAdminSession } from "@/lib/admin-auth";
import { createNotification, getReportNotifications, NOTIFICATION_SEVERITIES, NOTIFICATION_TYPES } from "@/lib/notifications";
import { database } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const recipientId = text(body?.recipientId, 128);
  const title = text(body?.title, 160);
  const message = text(body?.message, 3000);
  const type = text(body?.type, 30);
  const severity = text(body?.severity, 30);
  const reportId = text(body?.reportId, 128);
  const deadline = text(body?.deadline, 40);
  const requiresAcknowledgement = body?.requiresAcknowledgement === true;
  const blocksInteraction = body?.blocksInteraction === true;

  if (!recipientId || !title || !message ||
      !NOTIFICATION_TYPES.includes(type as typeof NOTIFICATION_TYPES[number]) ||
      !NOTIFICATION_SEVERITIES.includes(severity as typeof NOTIFICATION_SEVERITIES[number]) ||
      (blocksInteraction && !requiresAcknowledgement)) {
    return NextResponse.json({ error: "Invalid notification details." }, { status: 400 });
  }
  const recipient = await database.collection("user").findOne(
    { $or: [{ id: recipientId }, ...(ObjectId.isValid(recipientId) ? [{ _id: new ObjectId(recipientId) }] : [])] },
    { projection: { id: 1, _id: 1, deletedAt: 1 } },
  );
  if (!recipient || recipient.deletedAt) return NextResponse.json({ error: "Recipient not found." }, { status: 404 });
  const notification = await createNotification({
    recipientId,
    title,
    message,
    type: type as typeof NOTIFICATION_TYPES[number],
    severity: severity as typeof NOTIFICATION_SEVERITIES[number],
    adminId: session.user.id,
    reportId: reportId || undefined,
    deadline: deadline ? new Date(deadline) : undefined,
    requiresAcknowledgement,
    blocksInteraction,
  });
  return NextResponse.json({ notification }, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const reportId = new URL(request.url).searchParams.get("reportId")?.trim() ?? "";
  if (reportId) return NextResponse.json({ notifications: await getReportNotifications(reportId) });
  const reports = await database.collection<{ _id: ObjectId; reason: string; createdAt?: Date; status?: string }>("donorReports")
    .find({}, { projection: { _id: 1, reason: 1, createdAt: 1, status: 1 }, sort: { createdAt: -1 }, limit: 8 }).toArray();
  return NextResponse.json({
    notifications: reports.map((report) => ({
      id: report._id.toString(),
      text: `Report received: ${report.reason}`,
      time: report.createdAt?.toISOString() ?? null,
      unread: report.status === "Pending",
    })),
  }, { headers: { "Cache-Control": "no-store" } });
}
