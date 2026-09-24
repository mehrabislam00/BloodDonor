"use client";

import React, { useState } from "react";
import { AlignJustify } from "lucide-react";
import Footer from "../Components/Footer/Footer";
import DonorCard from "../Components/DonorCard/DonorCard";
import { DonorSearch } from "../Components/Find_A_Donor/DonorSearch";


// ── Mock donor data ───────────────────────────────────────────────────────

const ALL_DONORS: Donor[] = [
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
  {
    id: "4",
    initials: "FA",
    name: "Farzana Akter",
    verified: true,
    location: "Mohammadpur",
    bloodGroup: "AB+",
    available: false,
    activeTime: "Active Yesterday",
    lastDonation: "3 months ago",
  },
  {
    id: "5",
    initials: "TA",
    name: "Tanvir Ahmed",
    verified: true,
    location: "Bashundhara",
    bloodGroup: "O-",
    available: true,
    activeTime: "Active 3 hours ago",
    lastDonation: "6 months ago",
  },
  {
    id: "6",
    initials: "MR",
    name: "Maisha Rahman",
    verified: true,
    location: "Banani",
    bloodGroup: "A-",
    available: true,
    activeTime: "Active 5 hours ago",
    lastDonation: "4 months ago",
  },
  // page 2
  {
    id: "7",
    initials: "KA",
    name: "Kamal Ahmed",
    verified: false,
    location: "Gulshan",
    bloodGroup: "B+",
    available: true,
    activeTime: "Active 1 hour ago",
    lastDonation: "2 months ago",
  },
  {
    id: "8",
    initials: "SB",
    name: "Sultana Begum",
    verified: true,
    location: "Farmgate",
    bloodGroup: "AB-",
    available: false,
    activeTime: "Active 2 days ago",
    lastDonation: "7 months ago",
  },
  {
    id: "9",
    initials: "RI",
    name: "Rafiq Islam",
    verified: true,
    location: "Motijheel",
    bloodGroup: "O+",
    available: true,
    activeTime: "Active 30 minutes ago",
    lastDonation: "1 month ago",
  },
  {
    id: "10",
    initials: "TK",
    name: "Tahmina Khanam",
    verified: false,
    location: "Dhanmondi",
    bloodGroup: "A+",
    available: true,
    activeTime: "Active Today",
    lastDonation: "3 months ago",
  },
  {
    id: "11",
    initials: "MH",
    name: "Murad Hossain",
    verified: true,
    location: "Mirpur",
    bloodGroup: "B+",
    available: false,
    activeTime: "Active 3 days ago",
    lastDonation: "5 months ago",
  },
  {
    id: "12",
    initials: "NB",
    name: "Nasrin Begum",
    verified: true,
    location: "Uttara",
    bloodGroup: "O-",
    available: true,
    activeTime: "Active 4 hours ago",
    lastDonation: "2 months ago",
  },
  // page 3
  {
    id: "13",
    initials: "AR",
    name: "Arif Rahman",
    verified: true,
    location: "Banani",
    bloodGroup: "A-",
    available: true,
    activeTime: "Active 6 hours ago",
    lastDonation: "4 months ago",
  },
  {
    id: "14",
    initials: "SC",
    name: "Sabrina Chowdhury",
    verified: false,
    location: "Gulshan",
    bloodGroup: "AB+",
    available: false,
    activeTime: "Active Yesterday",
    lastDonation: "6 months ago",
  },
  {
    id: "15",
    initials: "JA",
    name: "Jahangir Alam",
    verified: true,
    location: "Mohammadpur",
    bloodGroup: "B-",
    available: true,
    activeTime: "Active 2 hours ago",
    lastDonation: "3 months ago",
  },
  {
    id: "16",
    initials: "RK",
    name: "Reshma Khatun",
    verified: true,
    location: "Bashundhara",
    bloodGroup: "O+",
    available: true,
    activeTime: "Active 1 hour ago",
    lastDonation: "5 months ago",
  },
  {
    id: "17",
    initials: "FK",
    name: "Farhan Khan",
    verified: false,
    location: "Farmgate",
    bloodGroup: "A+",
    available: true,
    activeTime: "Active Today",
    lastDonation: "2 months ago",
  },
  {
    id: "18",
    initials: "DI",
    name: "Dilruba Islam",
    verified: true,
    location: "Motijheel",
    bloodGroup: "AB-",
    available: false,
    activeTime: "Active 4 days ago",
    lastDonation: "8 months ago",
  },
];

const PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(ALL_DONORS.length / PER_PAGE);

// ── Page ──────────────────────────────────────────────────────────────────

const Find_A_Donor = () => {
  const [page, setPage] = useState(1);

  const pageDonors = ALL_DONORS.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const startIndex = (page - 1) * PER_PAGE + 1;
  const endIndex   = Math.min(page * PER_PAGE, ALL_DONORS.length);

  const goTo = (p: number) => {
    setPage(p);
    // Smooth-scroll to results heading
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="w-full">

      {/* ══════════════════════════════════════════
          Hero + Search
      ══════════════════════════════════════════ */}
      <section className="w-full border-b border-[#E7E0DB] bg-[#faf4f0] py-16 sm:py-20">
        <div className="container mx-auto w-full  px-4 sm:px-6 lg:px-8">

          {/* Badge */}
          <p className="mb-3 text-[14px] font-bold uppercase tracking-[0.16em] text-[#E2484D] pl-1">
            Donor Discovery
          </p>

          {/* Heading */}
          <h1 className="text-[38px] font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-[52px]">
            Find a Blood Donor
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-[15px] leading-relaxed text-[#9E8E85]">
            Search available donors by blood group and area.
          </p>

          {/* Search Card */}
          <div className="mt-10">
            <DonorSearch />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          Results Section
      ══════════════════════════════════════════ */}
      <section
        id="results"
        className="w-full bg-[#FAF7F4] pb-15 pt-15 scroll-mt-6"
      >
        <div className="container mx-auto w-full  px-4 sm:px-6 lg:px-8">

          {/* ── Results header ── */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#E2484D]">
                {ALL_DONORS.length} donors found
              </p>
              <h2 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[#1B1615] sm:text-[28px]">
                Recently active donors in Dhaka
              </h2>
            </div>

            {/* Sort label */}
            <span className="hidden items-center gap-2 text-[13px] text-[#9E8E85] sm:flex">
              <AlignJustify size={14} strokeWidth={2} />
              Sorted by recently active
            </span>
          </div>

          {/* ── Donor grid ── */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>

          {/* ── Pagination ── */}
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  "text-[14px] font-semibold transition-all duration-200",
                  p === page
                    ? "bg-[#E2484D] text-white shadow-[0_4px_14px_rgba(226,72,77,0.30)]"
                    : "border border-[#E7E0DB] bg-white text-[#68625E] hover:border-[#E2484D]/40 hover:text-[#E2484D]",
                ].join(" ")}
              >
                {p}
              </button>
            ))}
          </div>

        </div>
      </section>

      <Footer />

    </main>
  );
};

export default Find_A_Donor;