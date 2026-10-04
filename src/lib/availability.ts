const DAY_IN_MS = 86_400_000;

export const AVAILABILITY_OPTIONS = [
  "Available Now",
  "Available in 15 Days",
  "Available in 1 Month",
  "Available in 2 Months",
  "Available in 3 Months",
  "Unavailable",
];

export type AvailabilityRecord = {
  availability: string;
  availableFrom: string | null;
};

export type AvailabilityState = AvailabilityRecord & {
  available: boolean;
  label: string;
};

export function normalizeAvailability(value: string): string | null {
  const normalized = value.trim().toLowerCase().replace(/-/g, " ");
  if (normalized === "available" || normalized === "available now") return "Available Now";
  if (normalized === "unavailable") return "Unavailable";
  if (normalized === "available soon") return "Available in 1 Month";

  const future = normalized.match(/^available in (\d+) (days?|months?)$/);
  if (!future) return null;

  const amount = Number(future[1]);
  const unit = future[2].startsWith("day") ? "Days" : "Months";
  if (!Number.isInteger(amount) || amount < 1 || (unit === "Days" ? amount > 365 : amount > 12)) {
    return null;
  }

  return `Available in ${amount} ${unit}`;
}

function addMonths(date: Date, amount: number): Date {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return result;
}

function asDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function createAvailabilityRecord(
  value: string,
  now = new Date(),
): AvailabilityRecord | null {
  const availability = normalizeAvailability(value);
  if (!availability) return null;
  if (availability === "Unavailable" || availability === "Available Now") {
    return { availability, availableFrom: null };
  }

  const match = availability.match(/^Available in (\d+) (Days|Months)$/);
  if (!match) return null;
  const amount = Number(match[1]);
  const date = match[2] === "Days"
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + amount))
    : addMonths(now, amount);

  return { availability, availableFrom: asDateOnly(date) };
}

function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return asDateOnly(date) === value ? date : null;
}

function getLegacyAvailableFrom(
  availability: string,
  updatedAt: Date | string | undefined,
): Date | null {
  if (!updatedAt) return null;
  const updatedDate = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  if (Number.isNaN(updatedDate.getTime())) return null;

  const duration = availability.match(/^Available in (\d+) (Days|Months)$/);
  if (!duration) return null;
  const amount = Number(duration[1]);
  const start = new Date(Date.UTC(
    updatedDate.getUTCFullYear(),
    updatedDate.getUTCMonth(),
    updatedDate.getUTCDate(),
  ));
  return duration[2] === "Days"
    ? new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + amount))
    : addMonths(start, amount);
}

function getFutureLabel(target: Date, today: Date): string {
  const days = Math.ceil((target.getTime() - today.getTime()) / DAY_IN_MS);
  const months = (target.getUTCFullYear() - today.getUTCFullYear()) * 12
    + target.getUTCMonth() - today.getUTCMonth();

  if (months > 0) return `Available in ${months} ${months === 1 ? "month" : "months"}`;
  return `Available in ${days} ${days === 1 ? "day" : "days"}`;
}

export function getAvailabilityState(
  value: string,
  availableFrom?: string | null,
  now = new Date(),
  updatedAt?: Date | string,
): AvailabilityState {
  const availability = normalizeAvailability(value) ?? "Unavailable";
  if (availability === "Unavailable") {
    return { availability, availableFrom: null, available: false, label: "Unavailable" };
  }
  if (availability === "Available Now") {
    return { availability, availableFrom: null, available: true, label: "Available" };
  }

  const target = parseDateOnly(availableFrom) ?? getLegacyAvailableFrom(availability, updatedAt);
  if (!target) {
    return { availability, availableFrom: null, available: false, label: availability };
  }
  const scheduledDate = asDateOnly(target);

  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (target.getTime() <= today.getTime()) {
    return { availability: "Available Now", availableFrom: scheduledDate, available: true, label: "Available" };
  }

  return {
    availability,
    availableFrom: scheduledDate,
    available: false,
    label: getFutureLabel(target, today),
  };
}
