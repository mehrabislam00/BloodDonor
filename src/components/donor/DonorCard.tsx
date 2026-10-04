"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, MapPin, Clock,
  Calendar, MessageCircle, Flag,
} from "lucide-react";
import { ReportModal }  from "./ReportModal";
import { CallButton }   from "./CallButton";
import { WhatsAppConfirmationModal } from "./WhatsAppConfirmationModal";
import { toast } from "@/lib/toast";
import { buildWhatsAppUrl } from "@/lib/phone";
import { requireAuthentication } from "@/lib/require-authentication";

// ── Donor interface ───────────────────────────────────────────────────────────

export interface Donor {
  id:           string;
  initials:     string;
  name:         string;
  verified:     boolean;
  location:     string;
  bloodGroup:   string;
  available:    boolean;
  activeTime:   string;
  lastDonation: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DonorCard = ({ donor }: { donor: Donor }) => {
  const [showReport, setShowReport] = useState(false);
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] = useState(false);
  const router = useRouter();

  const getWhatsAppUrl = async () => {
    try {
      const response = await fetch(`/api/donor/contact?donorId=${encodeURIComponent(donor.id)}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.warning("Please log in to contact a donor on WhatsApp.");
        } else if (response.status === 404) {
          toast.warning("WhatsApp number is not available.");
        } else {
          toast.error("Could not contact this donor. Please try again.");
        }
        return null;
      }

      const contact = await response.json() as { whatsapp?: string; phone?: string };
      const number = contact.whatsapp;
      if (!number) {
        toast.warning("WhatsApp number is not available.");
        return null;
      }

      const url = buildWhatsAppUrl(number);
      if (!url) {
        toast.warning("WhatsApp number is not available.");
        return null;
      }

      return url;
    } catch {
      toast.error("Could not contact this donor. Please try again.");
      return null;
    }
  };

  const openWhatsAppConfirmation = async () => {
    if (showWhatsAppConfirmation) return;
    if (await requireAuthentication("Please log in to contact a donor on WhatsApp.")) {
      setShowWhatsAppConfirmation(true);
    }
  };

  const openProfile = async () => {
    if (await requireAuthentication("Please log in to view donor profiles.")) {
      router.push(`/donor/${donor.id}`);
    }
  };

  const openReport = async () => {
    if (await requireAuthentication("Please log in to report a donor.")) {
      setShowReport(true);
    }
  };

  return (
    <>
      <div
        className="
          group flex flex-col rounded-[18px]
          border border-[#EDE7E2] bg-white p-5
          shadow-[0_4px_20px_rgba(27,22,21,0.05)]
          transition-all duration-300 ease-out
          hover:-translate-y-1.5
          hover:border-[#E2484D]/20
          hover:shadow-[0_16px_40px_rgba(27,22,21,0.10)]
        "
      >

        {/* ── Row 1: Avatar / Name / Blood group ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-full bg-[#FFE4E4]
                text-[13px] font-bold text-[#E2484D]
                transition-transform duration-300
                group-hover:scale-110
              "
            >
              {donor.initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[15px] font-bold leading-tight text-[#1B1615]">
                  {donor.name}
                </span>
                {donor.verified && (
                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-[#9E8E85]">
                    <ShieldCheck size={12} strokeWidth={2.5} className="text-[#E2484D]" />
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#9E8E85]">
                <MapPin size={11} strokeWidth={2} />
                {donor.location}
              </div>
            </div>
          </div>

          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full bg-[#FFE4E4]
              text-[12px] font-bold text-[#E2484D]
              transition-all duration-300
              group-hover:bg-[#E2484D] group-hover:text-white
              group-hover:shadow-[0_4px_12px_rgba(226,72,77,0.30)]
            "
          >
            {donor.bloodGroup}
          </div>
        </div>

        {/* ── Row 2: Available badge + active time ── */}
        <div className="mt-4 flex items-center gap-3">
          {donor.available && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#EDFAF3] px-2.5 py-[5px] text-[11px] font-semibold text-[#1A9E56]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A9E56]" />
              Available
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[12px] text-[#9E8E85]">
            <Clock size={12} strokeWidth={2} />
            {donor.activeTime}
          </span>
        </div>

        {/* ── Row 3: Last donation ── */}
        <div className="mt-3.5 flex items-center gap-1.5 text-[12.5px] text-[#68625E]">
          <Calendar size={13} strokeWidth={1.8} className="shrink-0 text-[#9E8E85]" />
          Last donation:&nbsp;
          <span className="font-semibold">{donor.lastDonation}</span>
        </div>

        {/* ── Row 4: Call / WhatsApp ── */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">

          {/* Call — smart mobile/desktop behaviour */}
          <CallButton donorId={donor.id} donorName={donor.name} />

          <button
            type="button"
            onClick={() => void openWhatsAppConfirmation()}
            aria-label={`Open WhatsApp chat with ${donor.name}`}
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
            "
          >
            <MessageCircle size={14} strokeWidth={2} />
            WhatsApp
          </button>
        </div>

        {/* ── Row 5: View profile / Report ── */}
        <div className="mt-4 flex items-center justify-between border-t border-[#F5EFE9] pt-4">
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

      {showWhatsAppConfirmation && (
        <WhatsAppConfirmationModal
          onConfirm={getWhatsAppUrl}
          onClose={() => setShowWhatsAppConfirmation(false)}
        />
      )}

      {/* ReportModal — outside card to avoid z-index issues */}
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