import React from "react";
import Link from "next/link";
import DonorCard, { type Donor } from "@/components/donor/DonorCard";
import { getPublicDonorCards } from "@/lib/public-donors";

const AvailableDonors = async () => {
  const donors: Donor[] = (await getPublicDonorCards())
    .filter((donor) => donor.available)
    .slice(0, 3);

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
          {donors.slice(0, 3).map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AvailableDonors;