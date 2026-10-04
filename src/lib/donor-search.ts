const RECENT_ACTIVITY_WINDOW_MS = 6 * 60 * 60 * 1000;
const ACTIVE_NOW_WINDOW_MS = 60 * 60 * 1000;

export type DonorSearchFilters = {
  bloodGroup: string;
  area: string;
  activity: string;
};

export type SearchableDonor = {
  id: string;
  bloodGroup: string;
  location: string;
  availability: string;
  availableFrom?: string | null;
  lastActiveAt: number | null;
};

function hasRecentActivity(lastActiveAt: number | null, now: number): boolean {
  if (typeof lastActiveAt !== "number" || !Number.isFinite(lastActiveAt)) return false;
  const elapsed = now - lastActiveAt;
  return elapsed >= 0 && elapsed <= RECENT_ACTIVITY_WINDOW_MS;
}

function compareLastActive<T extends SearchableDonor>(first: T, second: T): number {
  const firstActivity = first.lastActiveAt;
  const secondActivity = second.lastActiveAt;
  const firstValid = typeof firstActivity === "number" && Number.isFinite(firstActivity);
  const secondValid = typeof secondActivity === "number" && Number.isFinite(secondActivity);

  if (firstValid && secondValid && firstActivity !== secondActivity) {
    return secondActivity - firstActivity;
  }
  if (firstValid !== secondValid) return firstValid ? -1 : 1;
  return first.id.localeCompare(second.id);
}

export function filterAndSortDonors<T extends SearchableDonor>(
  donors: readonly T[],
  filters: DonorSearchFilters,
  now = Date.now(),
): T[] {
  const filtered = donors.filter((donor) => {
    if (filters.bloodGroup && donor.bloodGroup.trim().toUpperCase() !== filters.bloodGroup.trim().toUpperCase()) {
      return false;
    }
    if (filters.area && donor.location.trim().toLowerCase() !== filters.area.trim().toLowerCase()) {
      return false;
    }

    if (filters.activity === "now") {
      return hasActivityWithin(donor.lastActiveAt, now, ACTIVE_NOW_WINDOW_MS);
    }
    if (filters.activity === "recent") {
      return hasRecentActivity(donor.lastActiveAt, now);
    }

    return true;
  });

  return filtered.sort(compareLastActive);
}

function hasActivityWithin(lastActiveAt: number | null, now: number, windowMs: number): boolean {
  if (typeof lastActiveAt !== "number" || !Number.isFinite(lastActiveAt)) return false;
  const elapsed = now - lastActiveAt;
  return elapsed >= 0 && elapsed <= windowMs;
}
