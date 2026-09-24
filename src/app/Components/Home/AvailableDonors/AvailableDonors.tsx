import React from "react";
import Link from "next/link";
import DonorCard, { type Donor } from "@/app/Components/DonorCard/DonorCard";

const DONORS: Donor[] = [
  {
    id: "1",
    initials: "RH",
    name: "Rahim Hasan",
    verified: true,
    location: "Mirpur",
    bloodGroup: "O+",
    available: true,
    activeTime: "Active 2 hours ago",
    lastDonation: "2 months ago",
  },
  {
    id: "2",
    initials: "NJ",
    name: "Nusrat Jahan",
    verified: true,
    location: "Dhanmondi",
    bloodGroup: "A+",
    available: true,
    activeTime: "Active 18 minutes ago",
    lastDonation: "4 months ago",
  },
  {
    id: "3",
    initials: "SK",
    name: "Samiul Karim",
    verified: true,
    location: "Uttara",
    bloodGroup: "B-",
    available: true,
    activeTime: "Active Today",
    lastDonation: "5 months ago",
  },
];

const AvailableDonors = () => {
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
            href="/Find_A_Doner"
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
          {DONORS.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AvailableDonors;