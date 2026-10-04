"use client";

// src/components/donor/DonorProfileModal.tsx

import React, { useEffect, useCallback, useState } from "react";
import {
  X, Droplets, MapPin, Clock,
  Calendar, MessageCircle,
} from "lucide-react";
import { CallButton }               from "./CallButton";
import { ContactConfirmationModal } from "./ContactConfirmationModal";
import { requireAuthentication }    from "@/lib/require-authentication";
import { useAvailabilityState }     from "@/hooks/useAvailabilityState";
import type { Donor }               from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────

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
  if (mins  < 60) return `${mins} min${mins   === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days  <  7) return `${days} day${days   === 1 ? "" : "s"} ago`;
  if (weeks <  5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (months< 12) return `${months} month${months=== 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function formatDateTime(ts: number | null): string | null {
  if (!ts) return null;
  return new Date(ts).toLocaleString("en-US", {
    weekday: "short", month: "long", day: "numeric",
    year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function formatDate(str: string | null | undefined): string | null {
  if (!str) return null;
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ── Detail row — matches the InfoRow style from the dashboard ─────────────

function DetailRow({
  icon: Icon, label, primary, secondary,
}: {
  icon:      React.ElementType;
  label:     string;
  primary:   React.ReactNode;
  secondary?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F4]">
        <Icon size={15} strokeWidth={1.9} className="text-[#9E8E85]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-medium text-[#B5A89F]">{label}</p>
        <p className="mt-0.5 truncate text-[14px] font-semibold text-[#1B1615]">
          {primary}
        </p>
        {secondary && (
          <p className="mt-0.5 text-[11.5px] text-[#9E8E85]">{secondary}</p>
        )}
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  donor:          Donor;
  onClose:        () => void;
  getWhatsAppUrl: () => Promise<string | null>;
}

// ── Modal ─────────────────────────────────────────────────────────────────

export function DonorProfileModal({ donor, onClose, getWhatsAppUrl }: Props) {
  const [showWhatsApp,  setShowWhatsApp]  = useState(false);
  const availState = useAvailabilityState(
    donor.availability ?? (donor.available ? "Available Now" : "Unavailable"),
    donor.availableFrom ?? null,
  );
  const isAvailable  = availState.available;
  const availLabel   = isAvailable
    ? "Available"
    : (availState?.label ?? donor.availability ?? "Unavailable");

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onKey]);

  const openWhatsApp = async () => {
    if (!isAvailable || showWhatsApp) return;
    if (await requireAuthentication("Please log in to contact a donor on WhatsApp."))
      setShowWhatsApp(true);
  };

  // Formatted values
  const lastActiveFull   = formatDateTime(donor.lastActiveAt);
  const lastActiveRel    = relativeTime(donor.lastActiveAt) ?? donor.activeTime ?? null;
  const lastDonationFull = formatDate(donor.lastDonation || null);
  const lastDonationRel  = relativeTime(donor.lastDonationAt);

  const lastDonationPrimary  = lastDonationFull
    ? `${lastDonationFull}${lastDonationRel ? ` · ${lastDonationRel}` : ""}`
    : "No donation recorded";

  const lastActivePrimary = lastActiveFull ?? lastActiveRel ?? "—";
  const lastActiveSec     = lastActiveFull && lastActiveRel ? lastActiveRel : undefined;

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        {/* backdrop — same darkness used by EditModal in the dashboard */}
        <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" />

        {/* ── Panel — matches card + dashboard card style exactly ── */}
        <div
          className="
            relative z-10 flex w-full max-w-[400px] flex-col overflow-hidden
            rounded-[22px] border border-[#EDE7E2] bg-white
            shadow-[0_32px_80px_rgba(27,22,21,0.18)]
          "
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Header ── */}
          <div className="flex items-center gap-3.5 border-b border-[#F0EAE5] px-6 py-5">

            {/* Avatar — matches DonorCard initials style */}
            <div className="relative shrink-0">
              <div className="
                flex h-12 w-12 items-center justify-center
                rounded-full bg-[#FFE4E4]
                text-[14px] font-bold text-[#E2484D]
              ">
                {donor.initials}
              </div>
              {/* availability dot */}
              <span className={[
                "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white",
                isAvailable ? "bg-[#1A9E56]" : "bg-[#9E8E85]",
              ].join(" ")} />
            </div>

            {/* Name + availability badge */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-extrabold tracking-[-0.02em] text-[#1B1615]">
                {donor.name}
              </p>
              <div className="mt-1">
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDFAF3] px-2.5 py-[4px] text-[11px] font-semibold text-[#1A9E56]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A9E56]" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F0EC] px-2.5 py-[4px] text-[11px] font-semibold text-[#68625E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9E8E85]" />
                    {availLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Blood group — matches DonorCard hover pill style */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[12px] font-bold text-[#E2484D]">
              {donor.bloodGroup}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full border border-[#EDE7E2] bg-white
                text-[#9E8E85] transition-all
                hover:bg-[#FAF7F4] hover:text-[#1B1615]
              "
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          {/* ── Contact buttons — same styling as DonorCard row 4 ── */}
          <div className="grid grid-cols-2 gap-2.5 px-6 py-4">
            <CallButton
              key={`${donor.id}-${isAvailable}`}
              donorId={donor.id}
              donorName={donor.name}
              disabled={!isAvailable}
            />
            <button
              type="button"
              onClick={() => void openWhatsApp()}
              disabled={!isAvailable}
              aria-label={`WhatsApp ${donor.name}`}
              className="
                flex h-[42px] items-center justify-center gap-2
                rounded-[11px] bg-[#FFE4E4]
                text-[13px] font-semibold text-[#E2484D]
                transition-all duration-200
                hover:bg-[#E2484D] hover:text-white
                hover:shadow-[0_4px_14px_rgba(226,72,77,0.25)]
                active:scale-[0.97]
                disabled:cursor-not-allowed disabled:opacity-50
                disabled:hover:bg-[#FFE4E4] disabled:hover:text-[#E2484D]
                disabled:hover:shadow-none
              "
            >
              <MessageCircle size={14} strokeWidth={2} />
              WhatsApp
            </button>
          </div>

          {/* ── Detail rows — matches dashboard InfoRow / PersonalInfoCard style ── */}
          <div className="divide-y divide-[#F5EFE9] border-t border-[#F0EAE5] px-6">

            <DetailRow
              icon={Droplets}
              label="Blood Group"
              primary={
                <span className="text-[#E2484D]">{donor.bloodGroup}</span>
              }
            />

            <DetailRow
              icon={MapPin}
              label="Area"
              primary={donor.location}
            />

            <DetailRow
              icon={Clock}
              label="Availability"
              primary={availLabel}
            />

            <DetailRow
              icon={Calendar}
              label="Last Donation"
              primary={lastDonationPrimary}
            />

            <DetailRow
              icon={Clock}
              label="Last Active"
              primary={lastActivePrimary}
              secondary={lastActiveSec}
            />

          </div>

          {/* ── Footer ── */}
          <div className="border-t border-[#F0EAE5] px-6 py-4">
            <button
              onClick={onClose}
              className="
                flex h-[44px] w-full items-center justify-center
                rounded-[11px] border border-[#E0D9D4] bg-white
                text-[13.5px] font-semibold text-[#68625E]
                transition-all duration-200
                hover:bg-[#FAF7F4] hover:text-[#1B1615]
              "
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* WhatsApp confirmation */}
      {showWhatsApp && isAvailable && (
        <ContactConfirmationModal
          message="You are about to contact this donor on WhatsApp."
          onConfirm={getWhatsAppUrl}
          onClose={() => setShowWhatsApp(false)}
        />
      )}
    </>
  );
}