import { getUserNotifications, updateUserNotification } from "@/lib/notifications";
import { blockedAccountResponse, getUserAccess } from "@/lib/user-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { session, blocked } = await getUserAccess(request);
  if (!session?.user || blocked) return NextResponse.json(blocked ? blockedAccountResponse : { error: "Unauthorized" }, { status: blocked ? 403 : 401 });
  return NextResponse.json({ notifications: await getUserNotifications(session.user.id) }, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request) {
  const { session, blocked } = await getUserAccess(request);
  if (!session?.user || blocked) return NextResponse.json(blocked ? blockedAccountResponse : { error: "Unauthorized" }, { status: blocked ? 403 : 401 });
  const body = await request.json().catch(() => null) as { notificationId?: unknown; action?: unknown } | null;
  const notificationId = typeof body?.notificationId === "string" ? body.notificationId.trim() : "";
  const field = body?.action === "acknowledge" ? "acknowledgedAt" : body?.action === "read" ? "readAt" : null;
  if (!notificationId || !field) return NextResponse.json({ error: "Invalid notification update." }, { status: 400 });
  const updated = await updateUserNotification(notificationId, session.user.id, field);
  if (!updated) return NextResponse.json({ error: "Notification not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}
