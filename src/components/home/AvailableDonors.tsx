"use client";

import React, { useMemo } from "react";
import Link from "next/link";
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
    <section className="w-full bg-[#faf4f0] py-16 sm:py-20">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* ── Header row ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-1xl font-bold uppercase tracking-[0.16em] text-[#E2484D] pl-1">
              Recently Active
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-[42px]">
              Donors who are available now
            </h2>
            <p className="mt-2.5 text-[16.5px] leading-relaxed text-[#9E8E85]">
              Availability and activity help you decide who to contact first.
            </p>
          </div>

          {/* View all button */}
          <Link
            href="/find-a-donor"
            className="
              flex h-[44px] shrink-0 items-center gap-1.5 self-start
              rounded-[12px] border border-[#E7E0DB] bg-white
              px-5 text-[13px] font-semibold text-[#1B1615]
              shadow-sm transition-all duration-200
              hover:border-[#E2484D]/30 hover:text-[#E2484D]
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
          <p className="mt-8 text-center text-[14px] text-[#9E8E85]">
            {selectedBloodGroup
              ? `No ${selectedBloodGroup} donors are currently available.`
              : "No donor profiles are registered yet."}
          </p>
        )}

      </div>
    </section>
  );
};

export default AvailableDonors;