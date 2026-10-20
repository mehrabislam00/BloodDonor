import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb";

export const NOTIFICATION_TYPES = ["warning", "ban", "information", "report"] as const;
export const NOTIFICATION_SEVERITIES = ["information", "warning", "critical"] as const;
export type NotificationType = typeof NOTIFICATION_TYPES[number];
export type NotificationSeverity = typeof NOTIFICATION_SEVERITIES[number];

export type NotificationDocument = {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  adminId: string;
  reportId?: string;
  action?: string;
  deadline?: Date;
  expiresAt?: Date;
  requiresAcknowledgement: boolean;
  blocksInteraction: boolean;
  createdAt: Date;
  readAt?: Date;
  acknowledgedAt?: Date;
};

const collection = database.collection<NotificationDocument>("notifications");

export function serializeNotification(notification: NotificationDocument) {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    severity: notification.severity,
    reportId: notification.reportId ?? null,
    action: notification.action ?? null,
    deadline: notification.deadline?.toISOString() ?? null,
    requiresAcknowledgement: notification.requiresAcknowledgement,
    blocksInteraction: notification.blocksInteraction,
    createdAt: notification.createdAt.toISOString(),
    readAt: notification.readAt?.toISOString() ?? null,
    acknowledgedAt: notification.acknowledgedAt?.toISOString() ?? null,
  };
}

export async function createNotification(input: Omit<NotificationDocument, "id" | "createdAt">) {
  const notification: NotificationDocument = {
    ...input,
    id: randomUUID(),
    createdAt: new Date(),
  };
  await collection.insertOne(notification);
  return serializeNotification(notification);
}

export async function getUserNotifications(recipientId: string) {
  const notifications = await collection.find(
    {
      recipientId,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    },
    { sort: { createdAt: -1 }, limit: 50 },
  ).toArray();
  return notifications.map(serializeNotification);
}

export async function updateUserNotification(
  notificationId: string,
  recipientId: string,
  field: "readAt" | "acknowledgedAt",
) {
  if (!notificationId || !ObjectId.isValid(notificationId) && notificationId.length < 10) return false;
  const result = await collection.updateOne(
    { id: notificationId, recipientId },
    { $set: { [field]: new Date(), readAt: new Date() } },
  );
  return result.matchedCount > 0;
}

export async function getReportNotifications(reportId: string) {
  const notifications = await collection.find({ reportId }, { sort: { createdAt: -1 } }).toArray();
  return notifications.map(serializeNotification);
}
