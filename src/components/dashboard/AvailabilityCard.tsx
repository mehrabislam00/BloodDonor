"use client";
import React from "react";
import { Loader2, Power } from "lucide-react";
import { Toggle } from "./ui/Toggle";
import { MiniSelect } from "./ui/MiniSelect";
import { AVAILABILITY_OPTIONS, AV_CONFIG } from "./constants";
import type { UserData } from "./types";
import { useAvailabilityState } from "@/hooks/useAvailabilityState";

interface Props {
  user: UserData;
  onUpdateAvailability: (v:string) => void;
  onToggleContact: () => void;
  onTurnOff: () => void;
  isSaving: boolean;
}

export function AvailabilityCard({ user, onUpdateAvailability, onToggleContact, onTurnOff, isSaving }: Props) {
  const state = useAvailabilityState(user.availability, user.availableFrom);
  const av = AV_CONFIG[state.available ? "Available Now" : user.availability] ?? AV_CONFIG["Unavailable"];
  const badgeLabel = state.available ? "Available" : "Unavailable";

  return (
    <div className="rounded-[18px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)]">

      {/* Status + turn-off */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#9E8E85]">Your donor status</p>
          <div className="mt-2.5 flex items-center gap-3">
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${av.badgeBg} ${av.badge}`}>
              <span className={`h-2 w-2 animate-pulse rounded-full ${av.dot}`} />
              {badgeLabel}
            </span>
            <span className={`text-[28px] font-extrabold tracking-[-0.025em] ${av.labelColor}`}>
              {state.available ? av.label : state.label === "Unavailable" ? av.label : state.label.toUpperCase()}
            </span>
          </div>
        </div>
        <button onClick={onTurnOff} disabled={isSaving}
          className="flex shrink-0 items-center gap-2 rounded-[11px] border border-[#E0D9D4] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#68625E] transition-all hover:border-[#E2484D]/30 hover:bg-[#FFF5F5] hover:text-[#E2484D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Power size={13} strokeWidth={2.2} />}
          {isSaving ? "Saving..." : state.available ? "Turn Off Availability" : "Turn On Availability"}
        </button>
      </div>

      {/* Contact toggle */}
      <div className="mt-5 flex items-center justify-between gap-4 rounded-[13px] bg-[#faf4f0] px-5 py-4">
        <div>
          <p className="text-[14px] font-semibold text-[#1B1615]">Available for contact</p>
          <p className="mt-0.5 max-w-xs text-[12.5px] leading-relaxed text-[#9E8E85]">
            Turn this on when you&apos;re currently willing to be contacted for blood donation.
          </p>
        </div>
        <Toggle on={state.available} onChange={onToggleContact} disabled={isSaving} />
      </div>

      {/* Change availability */}
      <div className="mt-5">
        <p className="mb-2 text-[12.5px] font-semibold text-[#403A37]">Change availability</p>
        <MiniSelect value={state.available ? "Available Now" : user.availability} onChange={onUpdateAvailability} options={AVAILABILITY_OPTIONS} disabled={isSaving} />
      </div>
    </div>
  );
}