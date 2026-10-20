import { ObjectId, type Filter } from "mongodb";
import { database } from "@/lib/mongodb";

type UserDocument = {
  _id?: ObjectId | string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  status?: string;
  deletedAt?: Date;
};

type ProfileDocument = {
  userId: string;
  phone?: string;
  area?: string;
  bloodGroup?: string;
  address?: string;
  availability?: string;
  availableFrom?: string | null;
  lastDonationDate?: string;
  isDonor?: boolean;
  updatedAt?: Date;
};

type BanDocument = { userId: string; active: boolean };

function idOf(user: UserDocument) {
  return user.id ?? user._id?.toString() ?? "";
}

function iso(value: Date | string | null | undefined) {
  return value instanceof Date ? value.toISOString() : typeof value === "string" ? value : null;
}

async function getAccountData() {
  const [users, profiles, donors, bans] = await Promise.all([
    database.collection<UserDocument>("user").find(
      { deletedAt: { $exists: false }, status: { $ne: "deleted" } },
      { projection: { _id: 1, id: 1, name: 1, email: 1, role: 1, isAdmin: 1, createdAt: 1, status: 1 }, sort: { createdAt: -1 } },
    ).toArray(),
    database.collection<ProfileDocument>("userProfiles").find({}).toArray(),
    database.collection<ProfileDocument>("donorProfiles").find({}).toArray(),
    database.collection<BanDocument>("adminBans").find({ active: true }, { projection: { userId: 1 } }).toArray(),
  ]);
  const profileById = new Map(profiles.map((profile) => [profile.userId, profile]));
  const donorById = new Map(donors.map((profile) => [profile.userId, profile]));
  const banned = new Set(bans.map((ban) => ban.userId));

  return users.map((user) => {
    const id = idOf(user);
    const profile = profileById.get(id);
    const donor = donorById.get(id);
    return {
      id,
      name: user.name ?? "Unnamed user",
      email: user.email ?? "",
      role: user.role ?? (user.isAdmin ? "admin" : "user"),
      createdAt: iso(user.createdAt),
      phone: profile?.phone ?? "",
      area: profile?.area ?? "",
      bloodGroup: profile?.bloodGroup ?? "",
      address: profile?.address ?? "",
      availability: profile?.availability ?? "Unavailable",
      availableFrom: profile?.availableFrom ?? null,
      lastDonationDate: profile?.lastDonationDate ?? donor?.lastDonationDate ?? "",
      isDonor: profile?.isDonor === true || Boolean(donor),
      isBanned: banned.has(id),
    };
  });
}

export async function getAdminUsers() {
  const users = await getAccountData();
  return users.map((user) => ({ ...user, status: user.isBanned ? "Banned" : "Active" }));
}

export async function getAdminDonors() {
  const users = await getAccountData();
  return users.filter((user) => user.isDonor).map((user) => ({
    ...user,
    status: user.isBanned ? "Banned" : "Active",
    availability: user.availability === "Available Now" ? "Available" : user.availability,
  }));
}

export async function getAdminReports() {
  const [reports, users] = await Promise.all([
    database.collection<{
      _id: ObjectId;
      donorId: string;
      reporterId: string;
      reason: string;
      description?: string;
      status?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }>("donorReports").find({}, { sort: { createdAt: -1 } }).toArray(),
    getAccountData(),
  ]);
  const byId = new Map(users.map((user) => [user.id, user]));
  return reports.map((report) => ({
    id: report._id.toString(),
    reportedUserId: report.donorId,
    donor: byId.get(report.donorId)?.name ?? byId.get(report.donorId)?.email ?? "Unavailable account",
    donorEmail: byId.get(report.donorId)?.email ?? report.donorId,
    reporter: byId.get(report.reporterId)?.name ?? byId.get(report.reporterId)?.email ?? "Unavailable account",
    reporterEmail: byId.get(report.reporterId)?.email ?? report.reporterId,
    reason: report.reason,
    description: report.description ?? "",
    status: report.status ?? "Pending",
    createdAt: iso(report.createdAt),
    updatedAt: iso(report.updatedAt),
  }));
}

export async function getAdminData(resource: "users"): Promise<{ users: Awaited<ReturnType<typeof getAdminUsers>> }>;
export async function getAdminData(resource: "donors"): Promise<{ donors: Awaited<ReturnType<typeof getAdminDonors>> }>;
export async function getAdminData(resource: "reports"): Promise<{ reports: Awaited<ReturnType<typeof getAdminReports>> }>;
export async function getAdminData(resource: "dashboard"): Promise<{
  stats: { totalUsers: number; totalDonors: number; availableDonors: number; unavailableDonors: number; pendingReports: number; resolvedReports: number; totalReports: number };
  users: Awaited<ReturnType<typeof getAdminUsers>>;
  reports: Awaited<ReturnType<typeof getAdminReports>>;
}>;
export async function getAdminData(resource: string): Promise<Record<string, unknown>>;
export async function getAdminData(resource: string) {
  if (resource === "users") return { users: await getAdminUsers() };
  if (resource === "donors") return { donors: await getAdminDonors() };
  if (resource === "reports") return { reports: await getAdminReports() };
  if (resource === "dashboard") {
    const [users, reports] = await Promise.all([getAdminUsers(), getAdminReports()]);
    return {
      stats: {
        totalUsers: users.length,
        totalDonors: users.filter((user) => user.isDonor).length,
        availableDonors: users.filter((user) => user.isDonor && (user.availability === "Available" || user.availability === "Available Now")).length,
        unavailableDonors: users.filter((user) => user.isDonor && user.availability !== "Available" && user.availability !== "Available Now").length,
        pendingReports: reports.filter((report) => report.status === "Pending").length,
        resolvedReports: reports.filter((report) => report.status === "Resolved").length,
        totalReports: reports.length,
      },
      users: users.slice(0, 100),
      reports: reports.slice(0, 100),
    };
  }
  throw new Error("Unknown admin resource");
}

export function userFilter(userId: string): Filter<UserDocument> {
  return ObjectId.isValid(userId)
    ? { $or: [{ id: userId }, { _id: userId }, { _id: new ObjectId(userId) }] }
    : { $or: [{ id: userId }, { _id: userId }] };
}
