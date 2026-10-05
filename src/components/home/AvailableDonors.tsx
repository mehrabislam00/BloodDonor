"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Droplets } from "lucide-react";
import DonorCard, { type Donor } from "@/components/donor/DonorCard";

type AvailableDonorsProps = {
  donors: Donor[];
  selectedBloodGroup: string | null;
};

const AvailableDonors = ({ donors, selectedBloodGroup }: AvailableDonorsProps) => {
  const matchingDonors = useMemo(() => {
    return donors
      .filter((donor) => (
        !selectedBloodGroup ||
        donor.bloodGroup.trim().toUpperCase() === selectedBloodGroup
      ))
      .sort((a, b) => {
        const availabilityOrder = Number(b.available) - Number(a.available);
        if (availabilityOrder !== 0) return availabilityOrder;

        const activityOrder = (b.lastActiveAt ?? -1) - (a.lastActiveAt ?? -1);
        if (activityOrder !== 0) return activityOrder;

        return a.name.localeCompare(b.name);
      });
  }, [donors, selectedBloodGroup]);

  return (
    <section className="w-full bg-[#faf4f0] dark:bg-background py-16 sm:py-20 border-t border-[#E7E0DB] dark:border-white/10">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* ── Header row ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-1xl font-bold uppercase tracking-[0.16em] text-[#E2484D] pl-1">
              Recently Active
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] dark:text-foreground sm:text-[42px]">
              Donors who are available now
            </h2>
            <p className="mt-2.5 text-[16.5px] leading-relaxed text-[#9E8E85] dark:text-muted-foreground">
              Availability and activity help you decide who to contact first.
            </p>
          </div>

          {/* View all button */}
          <Link
            href="/find-a-donor"
            className="
              flex h-[44px] shrink-0 items-center gap-1.5 self-start
              rounded-[12px] border border-[#E7E0DB] dark:border-white/10 bg-white dark:bg-card
              px-5 text-[13px] font-semibold text-[#1B1615] dark:text-foreground
              shadow-sm transition-all duration-200
              hover:border-[#E2484D]/30 hover:text-[#E2484D] dark:hover:text-[#E2484D]
              hover:shadow-[0_6px_18px_rgba(27,22,21,0.08)]
              active:scale-[0.98]
              sm:self-auto
            "
          >
            View all donors →
          </Link>
        </div>

        {/* ── Cards grid ── */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matchingDonors.slice(0, 3).map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
        {matchingDonors.length === 0 && (
          <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-[#EDE7E2] dark:border-white/10 bg-white/80 dark:bg-card/80 px-5 py-4 shadow-xs">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE9E9] dark:bg-[#E2484D]/15 text-[#E2484D]">
              <Droplets size={16} strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-[#403A37] dark:text-foreground">
                {selectedBloodGroup ? "No matching donors yet" : "No donors found"}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[#9E8E85] dark:text-muted-foreground">
                {selectedBloodGroup
                  ? `We couldn't find any ${selectedBloodGroup} donors available right now.`
                  : "There are no donor profiles to show right now."}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#B5A89F] dark:text-muted-foreground/70">
                {selectedBloodGroup
                  ? "Try another blood group or check again later."
                  : "Check back later as our donor community grows."}
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AvailableDonors;