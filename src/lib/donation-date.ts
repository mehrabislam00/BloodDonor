const DAY_IN_MS = 86_400_000;

export function normalizeDonationDate(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return value === "" ? "" : null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    return null;
  }

  return value;
}

export function formatDonationDate(
  value: string | null | undefined,
  locale = "en-US",
): string | null {
  const dateOnly = normalizeDonationDate(value);
  if (!dateOnly) return null;
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getDonationDateRelativeTime(
  value: string | null | undefined,
  now = new Date(),
): string | null {
  const dateOnly = normalizeDonationDate(value);
  if (!dateOnly) return null;

  const [year, month, day] = dateOnly.split("-").map(Number);
  const donationDay = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.floor((today - donationDay) / DAY_IN_MS);

  if (days === 0) return "Today";
  if (days < 0) {
    const untilDonation = Math.abs(days);
    return `In ${untilDonation} ${untilDonation === 1 ? "day" : "days"}`;
  }
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;

  const months = Math.round(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;

  const years = Math.round(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
