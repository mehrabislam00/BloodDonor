"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlignJustify } from "lucide-react";
import DonorCard, { type Donor } from "@/components/donor/DonorCard";
import { DonorSearch, type DonorSearchFilters } from "@/components/find-donor/DonorSearch";
import { toast } from "@/lib/toast";


const PER_PAGE = 6;

// ── Page ──────────────────────────────────────────────────────────────────

const Find_A_Donor = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filters, setFilters] = useState<DonorSearchFilters>({
    bloodGroup: "",
    area: "",
    availability: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    fetch("/api/donors", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { donors?: Donor[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Unable to load donors.");
        if (active) setDonors(result.donors ?? []);
      })
      .catch(() => {
        if (active) toast.error("Unable to load donors. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const filteredDonors = useMemo(() => donors.filter((donor) => {
    if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) return false;
    if (filters.area && donor.location.toLowerCase() !== filters.area.toLowerCase()) return false;
    if (filters.availability === "now" && !donor.available) return false;
    if (filters.availability === "recent") {
      const recent = donor.activeTime === "Updated today" ||
        /^Updated [1-7] days ago$/.test(donor.activeTime);
      if (!recent) return false;
    }
    return true;
  }), [donors, filters]);

  const totalPages = Math.ceil(filteredDonors.length / PER_PAGE);
  const pageDonors = filteredDonors.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            <DonorSearch onSearch={(nextFilters) => {
              setFilters(nextFilters);
              setPage(1);
            }} />
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
                {filteredDonors.length} donors found
              </p>
              <h2 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[#1B1615] sm:text-[28px]">
                Donors matching your search
              </h2>
            </div>

            {/* Sort label */}
            <span className="hidden items-center gap-2 text-[13px] text-[#9E8E85] sm:flex">
              <AlignJustify size={14} strokeWidth={2} />
              Sorted by recently updated
            </span>
          </div>

          {/* ── Donor grid ── */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
          {isLoading && (
            <p className="mt-8 text-center text-[14px] text-[#9E8E85]">
              Loading donors…
            </p>
          )}
          {!isLoading && donors.length === 0 && (
            <p className="mt-8 text-center text-[14px] text-[#9E8E85]">
              No donor profiles are registered yet.
            </p>
          )}
          {!isLoading && donors.length > 0 && filteredDonors.length === 0 && (
            <p className="mt-8 text-center text-[14px] text-[#9E8E85]">
              No donors match your search.
            </p>
          )}

          {/* ── Pagination ── */}
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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

    </main>
  );
};

export default Find_A_Donor;