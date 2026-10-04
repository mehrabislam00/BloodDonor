import { database } from "@/lib/mongodb";
import { getAvailabilityState } from "@/lib/availability";
import { normalizeDonationDate } from "@/lib/donation-date";
import { filterAndSortDonors, type DonorSearchFilters } from "@/lib/donor-search";

export type PublicDonorCard = {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  location: string;
  bloodGroup: string;
  available: boolean;
  availability: string;
  availableFrom: string | null;
  lastActiveAt: number | null;
  lastDonationDate: string | null;
};

type DonorProfileRecord = {
  userId: string;
  isDonor?: boolean;
  area?: string;
  bloodGroup?: string;
  availability?: string;
  availableFrom?: string | null;
  lastDonationDate?: string;
  lastActiveAt?: Date | string | number;
  updatedAt?: Date | string;
};

type DonorRegistryRecord = {
  userId: string;
  lastDonationDate?: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function parseDate(value: Date | string | number | undefined): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "string" && value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export async function getPublicDonorCards(
  filters: DonorSearchFilters = { bloodGroup: "", area: "", activity: "all" },
): Promise<PublicDonorCard[]> {
  const [registeredProfiles, donorRegistry] = await Promise.all([
    database
      .collection<DonorProfileRecord>("userProfiles")
      .find(
        { isDonor: true },
        {
          projection: {
            userId: 1,
            area: 1,
            bloodGroup: 1,
            availability: 1,
            availableFrom: 1,
            lastDonationDate: 1,
            lastActiveAt: 1,
            updatedAt: 1,
          },
        },
      )
      .toArray(),
    database
      .collection<DonorRegistryRecord>("donorProfiles")
      .find({}, { projection: { userId: 1, lastDonationDate: 1 } })
      .toArray(),
  ]);

  const profileIds = registeredProfiles
    .map((profile) => profile.userId)
    .filter((userId): userId is string => typeof userId === "string" && userId.length > 0);
  const donorIds = donorRegistry
    .map((donor) => donor.userId)
    .filter((userId): userId is string => typeof userId === "string" && userId.length > 0);
  const userIds = [...new Set([...profileIds, ...donorIds])];
  if (userIds.length === 0) return [];

  const [profiles, users] = await Promise.all([
    database
      .collection<DonorProfileRecord>("userProfiles")
      .find(
        { userId: { $in: userIds } },
        {
          projection: {
            userId: 1,
            area: 1,
            bloodGroup: 1,
            availability: 1,
            availableFrom: 1,
            lastDonationDate: 1,
            lastActiveAt: 1,
            updatedAt: 1,
          },
        },
      )
      .toArray(),
    database
      .collection<{ id: string; name?: string }>("user")
      .find(
        { id: { $in: userIds } },
        { projection: { id: 1, name: 1 } },
      )
      .toArray(),
  ]);

  const profilesById = new Map(profiles.map((profile) => [profile.userId, profile]));
  const donorsById = new Map(donorRegistry.map((donor) => [donor.userId, donor]));
  const namesById = new Map(users.map((user) => [user.id, user.name?.trim() || "Donor"]));

  const donors = userIds
    .map((userId) => {
      const profile = profilesById.get(userId);
      const registeredDonor = donorsById.get(userId);
      const name = namesById.get(userId) ?? "Donor";
      const availabilityState = getAvailabilityState(
        profile?.availability ?? "Unavailable",
        profile?.availableFrom,
        new Date(),
        profile?.updatedAt,
      );
      const lastActiveDate = parseDate(profile?.lastActiveAt);
      const savedDonationDate = typeof profile?.lastDonationDate === "string"
        && profile.lastDonationDate !== ""
        ? profile.lastDonationDate
        : registeredDonor?.lastDonationDate ?? profile?.lastDonationDate;
      const lastDonationDate = normalizeDonationDate(savedDonationDate);
      return {
        id: userId,
        initials: getInitials(name),
        name,
        verified: false,
        location: profile?.area?.trim() || "Location not provided",
        bloodGroup: profile?.bloodGroup?.trim() || "",
        available: availabilityState.available,
        availability: availabilityState.available ? "Available Now" : availabilityState.label,
        availableFrom: availabilityState.availableFrom,
        lastActiveAt: lastActiveDate?.getTime() ?? null,
        lastDonationDate,
      };
    });

  return filterAndSortDonors(donors, filters);
}
