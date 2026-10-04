/**
 * Phone number utilities for Bangladesh (+880) numbers.
 * Handles normalisation, WhatsApp URL building, tel: URI building,
 * validation, and display formatting.
 */

// ── Normalise ──────────────────────────────────────────────────────────────────

/**
 * Normalise any BD number to full international digits (no + or spaces)
 * ready for a wa.me URL.
 *
 * Formats handled:
 *   01XXXXXXXXX   (11 digits)  → 8801XXXXXXXXX
 *   +8801XXXXXXXX              → 8801XXXXXXXX
 *   8801XXXXXXXX  (13 digits)  → 8801XXXXXXXX
 */
export function normalizeForWhatsApp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("8801") && digits.length === 13) return digits;
  if (digits.startsWith("01") && digits.length === 11) return `88${digits}`;
  if (digits.startsWith("1") && digits.length === 10) return `880${digits}`;
  if (/^\s*(?:\+|00)/.test(trimmed) && digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  return null;
}

// ── URL builders ───────────────────────────────────────────────────────────────

export function buildWhatsAppUrl(raw: string | null | undefined): string | null {
  const n = normalizeForWhatsApp(raw);
  return n ? `https://wa.me/${n}` : null;
}

export function buildTelUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("01") && digits.length === 11) return `tel:+88${digits}`;
  if (digits.startsWith("8801") && digits.length === 13) return `tel:+${digits}`;
  if (digits.startsWith("1") && digits.length === 10) return `tel:+880${digits}`;
  if (/^\s*(?:\+|00)/.test(trimmed) && digits.length >= 10 && digits.length <= 15) {
    return `tel:+${digits}`;
  }
  return null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Recognizes Bangladesh local and international formats plus explicit international numbers. */
export function isValidPhone(raw: string | null | undefined): boolean {
  if (!raw?.trim()) return false;
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  return (
    (digits.startsWith("01") && digits.length === 11) ||
    (digits.startsWith("8801") && digits.length === 13) ||
    (digits.startsWith("1") && digits.length === 10) ||
    (/^\s*(?:\+|00)/.test(trimmed) && digits.length >= 10 && digits.length <= 15)
  );
}

/**
 * Format for UI display — always shows the local 01… format.
 *   8801712345678 → 01712345678
 *   01712345678   → 01712345678
 */
export function formatPhoneDisplay(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("8801") && digits.length === 13) return `0${digits.slice(3)}`;
  if (digits.startsWith("1") && digits.length === 10) return `0${digits}`;
  if (digits.length >= 10) return raw.trim();
  return raw.trim();
}