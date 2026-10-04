"use client";

// src/components/donor/DonorCard.tsx

import React, { useState } from "react";
import {
  MapPin, Clock, Droplets,
  Calendar, MessageCircle, Flag,
} from "lucide-react";
import type { Donor }                    from "./types";
import { DonorProfileModal }             from "./DonorProfileModal";
import { ReportModal }                   from "./ReportModal";
import { CallButton }                    from "./CallButton";
import { ContactConfirmationModal }      from "./ContactConfirmationModal";
import { toast }                         from "@/lib/toast";
import { buildWhatsAppUrl }              from "@/lib/phone";
import { requireAuthentication }         from "@/lib/require-authentication";
import { useAvailabilityState }           from "@/hooks/useAvailabilityState";
export type { Donor } from "./types";

// ── Helpers (unchanged from previous version) ─────────────────────────────

function relativeTime(ts: number | null): string | null {
  if (!ts) return null;
  const diff   = Date.now() - ts;
  const mins   = Math.floor(diff / 60_000);
  const hours  = Math.floor(diff / 3_600_000);
  const days   = Math.floor(diff / 86_400_000);
  const weeks  = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years  = Math.floor(days / 365);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins} minute${mins   === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours   === 1 ? "" : "s"} ago`;
  if (days  <  7) return `${days} day${days      === 1 ? "" : "s"} ago`;
  if (weeks <  5) return `${weeks} week${weeks   === 1 ? "" : "s"} ago`;
  if (months< 12) return `${months} month${months=== 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function parseAvailability(
  availability: string,
  available: boolean,
): { isNow: boolean; label: string } {
  const raw = (availability ?? "").trim().toLowerCase();
  if (!raw || raw === "available now" || available)
    return { isNow: true, label: "Available" };
  if (raw === "unavailable")
    return { isNow: false, label: "Unavailable" };
  const stripped = availability.replace(/^available in\s*/i, "").trim();
  return { isNow: false, label: `Available in ${stripped}` };
}

// ── Component ─────────────────────────────────────────────────────────────

const DonorCard = ({ donor }: { donor: Donor }) => {
  const [showReport,               setShowReport]               = useState(false);
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] = useState(false);
  const [showProfile,              setShowProfile              ] = useState(false);

  // ── Derived display values ─────────────────────────────────────────────

  const activeLabel = (() => {
    const computed = relativeTime(donor.lastActiveAt);
    if (computed) return `Active ${computed}`;
    return donor.activeTime || null;
  })();

  const lastDonationLabel = (() => {
    if (donor.lastDonationAt) {
      const rel = relativeTime(donor.lastDonationAt);
      if (rel) return rel;
    }
    return donor.lastDonation || null;
  })();

  const availabilityState = useAvailabilityState(
    donor.availability ?? (donor.available ? "Available Now" : "Unavailable"),
    donor.availableFrom ?? null,
  );
  const donorAvailable = availabilityState.available;
  const { isNow, label: availLabel } = parseAvailability(
    donorAvailable ? "Available Now" : availabilityState.label,
    donorAvailable,
  );

  // ── Shared WhatsApp fetch — passed to both card and modal ─────────────

  const getWhatsAppUrl = async () => {
    if (!donorAvailable) {
      toast.warning("This donor is not currently available for contact.");
      return null;
    }
    try {
      const response = await fetch(
        `/api/donor/contact?donorId=${encodeURIComponent(donor.id)}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        if (response.status === 401)
          toast.warning("Please log in to contact a donor on WhatsApp.");
        else if (response.status === 404)
          toast.warning("WhatsApp number is not available.");
        else if (response.status === 403)
          toast.warning("This donor is not currently available for contact.");
        else
          toast.error("Could not contact this donor. Please try again.");
        return null;
      }
      const contact = await response.json() as { whatsapp?: string; phone?: string };
      const number  = contact.whatsapp;
      if (!number) { toast.warning("WhatsApp number is not available."); return null; }
      const url = buildWhatsAppUrl(number);
      if (!url)    { toast.warning("WhatsApp number is not available."); return null; }
      return url;
    } catch {
      toast.error("Could not contact this donor. Please try again.");
      return null;
    }
  };

  // ── Action handlers ───────────────────────────────────────────────────

  const openWhatsAppConfirmation = async () => {
    if (!donorAvailable || showWhatsAppConfirmation) return;
    if (await requireAuthentication("Please log in to contact a donor on WhatsApp."))
      setShowWhatsAppConfirmation(true);
  };

  // "View profile" now opens the modal; auth guard kept
  const openProfile = async () => {
    if (await requireAuthentication("Please log in to view donor profiles."))
      setShowProfile(true);
  };

  const openReport = async () => {
    if (await requireAuthentication("Please log in to report a donor."))
      setShowReport(true);
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          CARD — identical to previous version, no styling changes
      ───────────────────────────────────────────────────────────────── */}
      <div className="
        group flex flex-col rounded-[18px]
        border border-[#EDE7E2] bg-white p-5
        shadow-[0_4px_20px_rgba(27,22,21,0.05)]
        transition-all duration-300 ease-out
        hover:-translate-y-1.5
        hover:border-[#E2484D]/20
        hover:shadow-[0_16px_40px_rgba(27,22,21,0.10)]
      ">

        {/* Row 1 — Avatar / Name / Blood group */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-full bg-[#FFE4E4]
              text-[13px] font-bold text-[#E2484D]
              transition-transform duration-300 group-hover:scale-110
            ">
              {donor.initials}
            </div>
            <div>
              {/* verified badge intentionally removed */}
              <span className="text-[15px] font-bold leading-tight text-[#1B1615]">
                {donor.name}
              </span>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#9E8E85]">
                <MapPin size={11} strokeWidth={2} />
                {donor.location}
              </div>
            </div>
          </div>

          <div className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-full bg-[#FFE4E4]
            text-[12px] font-bold text-[#E2484D]
            transition-all duration-300
            group-hover:bg-[#E2484D] group-hover:text-white
            group-hover:shadow-[0_4px_12px_rgba(226,72,77,0.30)]
          ">
            {donor.bloodGroup}
          </div>
        </div>

        {/* Row 2 — Availability + active time */}
        <div className="mt-4 flex items-center gap-3">
          {isNow ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#EDFAF3] px-2.5 py-[5px] text-[11px] font-semibold text-[#1A9E56]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A9E56]" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-[#F5F0EC] px-2.5 py-[5px] text-[11px] font-semibold text-[#68625E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9E8E85]" />
              {availLabel}
            </span>
          )}
          {activeLabel && (
            <span className="flex items-center gap-1.5 text-[12px] text-[#9E8E85]">
              <Clock size={12} strokeWidth={2} />
              {activeLabel}
            </span>
          )}
        </div>

        {/* Row 3 — Last donation */}
        {lastDonationLabel ? (
          <div className="mt-3.5 flex items-center gap-1.5 text-[12.5px] text-[#68625E]">
            <Droplets size={13} strokeWidth={1.8} className="shrink-0 text-[#9E8E85]" />
            Last donation&nbsp;·&nbsp;
            <span className="font-semibold">{lastDonationLabel}</span>
          </div>
        ) : (
          <div className="mt-3.5 flex items-center gap-1.5 text-[12.5px] text-[#C5B8B0]">
            <Calendar size={13} strokeWidth={1.8} className="shrink-0" />
            No donation recorded
          </div>
        )}

        {/* Row 4 — Call / WhatsApp */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <CallButton
            key={`${donor.id}-${donorAvailable}`}
            donorId={donor.id}
            donorName={donor.name}
            disabled={!donorAvailable}
          />
          <button
            type="button"
            onClick={() => void openWhatsAppConfirmation()}
            disabled={!donorAvailable}
            aria-label={`Open WhatsApp chat with ${donor.name}`}
            title={donorAvailable ? "Contact this donor on WhatsApp" : "Donor not currently available"}
            className="
              flex h-[42px] items-center justify-center gap-2
              rounded-[11px] bg-[#FFE4E4]
              text-[13px] font-semibold text-[#E2484D]
              transition-all duration-200
              [&_svg]:transition-transform [&_svg]:duration-200
              hover:bg-[#E2484D] hover:text-white
              hover:shadow-[0_4px_14px_rgba(226,72,77,0.25)]
              hover:[&_svg]:scale-110
              active:scale-[0.97]
              disabled:cursor-not-allowed disabled:opacity-50
              disabled:hover:bg-[#FFE4E4] disabled:hover:text-[#E2484D]
              disabled:hover:shadow-none disabled:active:scale-100
            "
          >
            <MessageCircle size={14} strokeWidth={2} />
            WhatsApp
          </button>
        </div>

        {/* Row 5 — View profile / Report */}
        <div className="mt-4 flex items-center justify-between border-t border-[#F5EFE9] pt-4">
          {/* ← only change: onClick now opens modal instead of router.push */}
          <button
            type="button"
            onClick={openProfile}
            className="
              text-[13px] font-semibold text-[#E2484D]
              underline-offset-2 transition-all duration-200
              hover:underline hover:text-[#C73E43]
            "
          >
            View profile →
          </button>
          <button
            type="button"
            onClick={openReport}
            className="
              flex items-center gap-1.5
              text-[12px] text-[#C5B8B0]
              transition-colors duration-200
              hover:text-[#68625E]
            "
          >
            <Flag size={12} strokeWidth={2} />
            Report
          </button>
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Profile modal — new */}
      {showProfile && (
        <DonorProfileModal
          donor={donor}
          onClose={() => setShowProfile(false)}
          getWhatsAppUrl={getWhatsAppUrl}
        />
      )}

      {/* WhatsApp confirmation (card-level) */}
      {showWhatsAppConfirmation && donorAvailable && (
        <ContactConfirmationModal
          message="You are about to contact this donor on WhatsApp."
          onConfirm={getWhatsAppUrl}
          onClose={() => setShowWhatsAppConfirmation(false)}
        />
      )}

      {/* Report modal */}
      {showReport && (
        <ReportModal
          donorId={donor.id}
          donorName={donor.name}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
};

export default DonorCard;