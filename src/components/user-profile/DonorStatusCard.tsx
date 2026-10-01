"use client";

import React from "react";
import Link from "next/link";
import { Droplets, ArrowRight, Heart } from "lucide-react";
import type { UserProfile } from "./types";

interface Props {
  user: UserProfile;
}

export default function DonorStatusCard({ user }: Props) {
  if (!user.isDonor) {
    return (
      <div className="flex items-center justify-between gap-6 rounded-[20px] border border-[#EDE7E2] bg-white px-7 py-6 shadow-[0_8px_28px_rgba(27,22,21,0.06)]">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#F5F0EC] px-3 py-1 text-[11px] font-semibold text-[#68625E]">
            <Heart size={11} strokeWidth={2.5} />
            Donor status
          </div>
          <p className="text-[17px] font-extrabold leading-tight text-[#1B1615]">
            Not Registered as a Blood Donor
          </p>
          <p className="mt-1 text-[13px] text-[#9E8E85]">
            Become a donor and help someone in need.
          </p>
        </div>
        <Link
          href="/become-a-donor"
          className="flex shrink-0 items-center gap-1.5 rounded-[11px] bg-[#E2484D] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#D83E43] hover:shadow-md"
        >
          Become a Donor
          <ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-6 rounded-[20px] bg-[#E2484D] px-7 py-6 shadow-[0_12px_40px_rgba(226,72,77,0.18)]">
      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white">
          <Heart size={11} strokeWidth={2.5} fill="currentColor" />
          Blood Donor
        </div>
        <p className="text-[17px] font-extrabold leading-tight text-white">
          Registered as a Blood Donor
        </p>
        <p className="mt-1 text-[13px] text-white/70">
          Your donor profile is active.
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        {/* Blood group badge */}
        {user.bloodGroup && (
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
            <Droplets size={15} strokeWidth={2} className="text-white" />
            <span className="text-[16px] font-extrabold text-white">{user.bloodGroup}</span>
          </div>
        )}
        <Link
          href="/blood-donor-profile"
          className="
            flex items-center gap-1.5
            rounded-[11px] bg-white px-5 py-2.5
            text-[13px] font-semibold text-[#E2484D]
            transition-all duration-200
            hover:bg-[#FFF0F0] hover:shadow-md
          "
        >
          View Donor Dashboard
          <ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}