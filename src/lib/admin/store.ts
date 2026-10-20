import { ObjectId, type Filter } from "mongodb";
import { database } from "@/lib/mongodb";

export type AdminBan = {
  _id?: ObjectId;
  userId: string;
  reason: string;
  active: boolean;
  createdAt: Date;
  createdBy: string;
  liftedAt?: Date;
  liftedBy?: string;
};

export async function getActiveBan(userId: string) {
  return database.collection<AdminBan>("adminBans").findOne({ userId, active: true });
}

export async function isAccountBlocked(userId: string) {
  const [ban, deleted] = await Promise.all([
    getActiveBan(userId),
    database.collection("adminDeletedUsers").findOne({ userId }, { projection: { _id: 1 } }),
  ]);
  return Boolean(ban || deleted);
}

export async function writeAdminAudit(
  action: string,
  actorId: string,
  targetUserId: string | null,
  details: Record<string, unknown> = {},
) {
  await database.collection("adminAuditLogs").insertOne({
    action,
    actorId,
    targetUserId,
    details,
    createdAt: new Date(),
  });
}

export async function softDeleteUser(userId: string, actorId: string) {
  const users = database.collection<Record<string, unknown>>("user");
  const userFilter = (ObjectId.isValid(userId)
    ? { $or: [{ id: userId }, { _id: userId }, { _id: new ObjectId(userId) }] }
    : { $or: [{ id: userId }, { _id: userId }] }) as Filter<Record<string, unknown>>;
  const [user, profile, donor] = await Promise.all([
    users.findOne(userFilter),
    database.collection("userProfiles").findOne({ userId }),
    database.collection("donorProfiles").findOne({ userId }),
  ]);

  if (!user) return false;

  await database.collection("adminDeletedUsers").updateOne(
    { userId },
    {
      $set: {
        userId,
        user,
        profile,
        donor,
        deletedAt: new Date(),
        deletedBy: actorId,
      },
    },
    { upsert: true },
  );
  await Promise.all([
    users.updateOne(userFilter, { $set: { deletedAt: new Date(), status: "deleted" } }),
    database.collection("userProfiles").deleteOne({ userId }),
    database.collection("donorProfiles").deleteOne({ userId }),
  ]);
  await writeAdminAudit("user.soft_deleted", actorId, userId);
  return true;
}

export async function setDonorBan(
  userId: string,
  actorId: string,
  reason: string,
  active: boolean,
) {
  const bans = database.collection<AdminBan>("adminBans");
  if (active) {
    await bans.updateOne(
      { userId },
      {
        $set: { userId, reason, active: true, createdAt: new Date(), createdBy: actorId },
        $unset: { liftedAt: "", liftedBy: "" },
      },
      { upsert: true },
    );
    await writeAdminAudit("donor.banned", actorId, userId, { reason });
  } else {
    await bans.updateOne(
      { userId, active: true },
      { $set: { active: false, liftedAt: new Date(), liftedBy: actorId } },
    );
    await writeAdminAudit("donor.unbanned", actorId, userId);
  }
}

export async function deleteReport(reportId: string, actorId: string) {
  if (!ObjectId.isValid(reportId)) return false;
  const result = await database.collection("donorReports").deleteOne({ _id: new ObjectId(reportId) });
  if (result.deletedCount > 0) {
    await writeAdminAudit("report.deleted", actorId, null, { reportId });
    return true;
  }
  return false;
}
