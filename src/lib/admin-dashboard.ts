import { database } from "@/lib/mongodb";
import type { ObjectId } from "mongodb";

type AuthUser = {
  _id?: ObjectId;
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: string;
  isAdmin?: boolean;
  createdAt?: Date;
};

type UserProfile = {
  userId: string;
  phone?: string;
  whatsapp?: string;
  area?: string;
  bloodGroup?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  lastDonationDate?: string;
  isDonor?: boolean;
  availability?: string;
  availableFrom?: string | null;
  updatedAt?: Date;
};

type DonorProfile = {
  userId: string;
  lastDonationDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type DonorReport = {
  _id?: ObjectId;
  donorId: string;
  reporterId: string;
  reason: string;
  description?: string;
  createdAt?: Date;
};

function serializeDate(value: Date | undefined) {
  return value instanceof Date ? value.toISOString() : null;
}

export async function getAdminDashboardData() {
  const [users, profiles, donors, reports] = await Promise.all([
    database.collection<AuthUser>("user")
      .find(
        {},
        {
          projection: {
            _id: 1,
            id: 1,
            name: 1,
            email: 1,
            image: 1,
            role: 1,
            isAdmin: 1,
            createdAt: 1,
          },
          sort: { createdAt: -1 },
          limit: 100,
        },
      )
      .toArray(),
    database.collection<UserProfile>("userProfiles").find({}, { projection: { _id: 0 } }).toArray(),
    database.collection<DonorProfile>("donorProfiles").find({}, { projection: { _id: 0 } }).toArray(),
    database.collection<DonorReport>("donorReports")
      .find({}, { sort: { createdAt: -1 }, limit: 100 })
      .toArray(),
  ]);

  const profilesByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));
  const donorsByUserId = new Map(donors.map((donor) => [donor.userId, donor]));
  const bans = await database.collection<{ userId: string }>("adminBans")
    .find({ active: true }, { projection: { userId: 1 } }).toArray();
  const bannedIds = new Set(bans.map((ban) => ban.userId));

  const accountRows = users.map((user) => {
    const userId = user.id ?? user._id?.toString() ?? "";
    const profile = profilesByUserId.get(userId);
    const donor = donorsByUserId.get(userId);

    return {
      id: userId,
      name: user.name ?? "Unnamed user",
      email: user.email ?? "",
      image: user.image ?? null,
      role: user.role ?? (user.isAdmin ? "admin" : "user"),
      createdAt: serializeDate(user.createdAt),
      phone: profile?.phone ?? "",
      whatsapp: profile?.whatsapp ?? "",
      area: profile?.area ?? "",
      bloodGroup: profile?.bloodGroup ?? "",
      gender: profile?.gender ?? "",
      dateOfBirth: profile?.dateOfBirth ?? "",
      address: profile?.address ?? "",
      availability: profile?.availability ?? "Unavailable",
      availableFrom: profile?.availableFrom ?? null,
      isDonor: profile?.isDonor === true || Boolean(donor),
      isBanned: bannedIds.has(userId),
      lastDonationDate: profile?.lastDonationDate ?? donor?.lastDonationDate ?? "",
      profileUpdatedAt: serializeDate(profile?.updatedAt),
    };
  });

  const userIds = new Map(accountRows.map((user) => [user.id, user]));

  return {
    users: accountRows,
    reports: reports.map((report) => ({
      ...report,
      id: report._id?.toString() ?? "",
      reporterEmail: userIds.get(report.reporterId)?.email ?? report.reporterId,
      donorEmail: userIds.get(report.donorId)?.email ?? report.donorId,
      createdAt: serializeDate(report.createdAt),
    })),
    stats: {
      totalUsers: users.length,
      totalDonors: accountRows.filter((user) => user.isDonor).length,
      availableDonors: accountRows.filter(
        (user) => user.isDonor && user.availability.toLowerCase() === "available",
      ).length,
      totalReports: reports.length,
    },
  };
}
