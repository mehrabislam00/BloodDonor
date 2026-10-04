"use client";

import React, {
  useState, useEffect, useRef, useCallback, useSyncExternalStore,
} from "react";
import { Phone, Copy, Check } from "lucide-react";
import { buildTelUrl, formatPhoneDisplay, isValidPhone } from "@/lib/phone";
import { toast } from "@/lib/toast";
import { requireAuthentication } from "@/lib/require-authentication";
import { useProfileData } from "@/components/profile/ProfileDataProvider";

interface Props {
  donorId:     string;
  donorName?:  string;
  disabled?:   boolean;
}

// ── Mobile detection — runs only client-side ──────────────────────────────────

const MOBILE_QUERY = "(hover: none) and (pointer: coarse)";

function subscribeToMobile(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getMobileServerSnapshot() {
  return false;
}

function useMobile() {
  return useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getMobileServerSnapshot);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CallButton({ donorId, donorName, disabled = false }: Props) {
  const isMobile            = useMobile();
  const { userId } = useProfileData();
  const [revealed, setRevealed] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [contact, setContact] = useState<{ userId: string; phone: string } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const phone = contact?.userId === userId ? contact.phone : null;
  const display = phone ? formatPhoneDisplay(phone) : "";

  // Close on click-outside (desktop only)
  useEffect(() => {
    if (!revealed) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setRevealed(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [revealed]);

  const handleCopy = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled || !display) return;
    if (!(await requireAuthentication("Please log in to contact a donor."))) {
      setRevealed(false);
      setContact(null);
      return;
    }
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      toast.success("Number copied to clipboard.");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  }, [disabled, display]);

  const requestContact = async () => {
    if (disabled) return;
    if (!(await requireAuthentication("Please log in to contact a donor."))) return;
    try {
      const response = await fetch(`/api/donor/contact?donorId=${encodeURIComponent(donorId)}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.warning("Please log in to contact a donor.");
        } else if (response.status === 404) {
          toast.warning("Phone number is not available.");
        } else if (response.status === 403) {
          toast.warning("This donor is not currently available for contact.");
        } else {
          toast.error("Could not contact this donor. Please try again.");
        }
        return;
      }

      const contact = await response.json() as { phone?: string };
      const phone = typeof contact.phone === "string" ? contact.phone.trim() : "";
      if (!isValidPhone(phone)) {
        toast.warning("Phone number is not available.");
        return;
      }

      if (!userId) {
        toast.error("Unable to verify your login. Please try again.");
        return;
      }
      setContact({ userId, phone });
      if (isMobile) {
        const telUrl = buildTelUrl(phone);
        if (!telUrl) {
          toast.warning("Phone number is not available.");
          return;
        }
        window.location.assign(telUrl);
      } else {
        setRevealed(true);
      }
    } catch {
      toast.error("Could not contact this donor. Please try again.");
    }
  };

  // ── Shared Tailwind classes ───────────────────────────────────────────────

  const base = [
    "relative flex h-[42px] w-full items-center justify-center gap-2",
    "overflow-hidden rounded-[11px] border",
    "text-[13px] font-semibold select-none",
    "transition-all duration-200",
    "active:scale-[0.97]",
  ].join(" ");

  const idle     = "border-[#E7E0DB] bg-white text-[#1B1615] hover:border-[#E2484D]/40 hover:bg-[#FFF5F5] hover:text-[#E2484D] hover:shadow-sm";
  const active   = "border-[#E2484D]/40 bg-[#FFF5F5] text-[#E2484D] hover:bg-[#FFE4E4]";

  return (
    <div ref={wrapRef}>
      <button
        type="button"
        onClick={() => (revealed ? void handleCopy() : void requestContact())}
        disabled={disabled}
        className={`${base} ${revealed ? active : idle} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#E7E0DB] disabled:hover:bg-white disabled:hover:text-[#1B1615] disabled:hover:shadow-none`}
        aria-label={
          revealed
            ? `Copy number ${display}`
            : disabled
              ? `${donorName ?? "Donor"} is unavailable`
              : `Call ${donorName ?? "donor"}`
        }
        aria-expanded={revealed}
        title={
          revealed
            ? `Click to copy • ${display}`
            : disabled
              ? "This donor is not currently available for contact"
              : "Contact this donor"
        }
      >
        {/* ── Layer 1: "Call" — slides up & fades out ── */}
        <span
          aria-hidden={revealed}
          className={[
            "absolute inset-0 flex items-center justify-center gap-2",
            "transition-all duration-[220ms] ease-out",
            revealed ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0",
          ].join(" ")}
        >
          <Phone size={14} strokeWidth={2} />
          Call
        </span>

        {/* ── Layer 2: number + copy icon — slides up & fades in ── */}
        <span
          aria-hidden={!revealed}
          aria-live="polite"
          className={[
            "absolute inset-0 flex items-center justify-center gap-1.5",
            "font-mono text-[11.5px] tracking-tight",
            "transition-all duration-[220ms] ease-out",
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          <Phone size={13} strokeWidth={2} className="shrink-0" />
          <span className="shrink-0">{display}</span>
          {copied ? (
            <Check size={11} strokeWidth={2.5} className="shrink-0 text-[#1A9E56]" />
          ) : (
            <Copy  size={11} strokeWidth={2}   className="shrink-0 opacity-50" />
          )}
        </span>
      </button>
    </div>
  );
}