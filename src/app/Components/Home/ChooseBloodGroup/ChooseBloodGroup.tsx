"use client";

import React, { useState } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ChooseBloodGroup = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#FAF7F4] py-16 sm:py-20">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-6">

        {/* ── Badge ── */}
        <p className="mb-3 text-1xl font-bold uppercase tracking-[0.16em] text-[#E2484D] pl-1">
          Search by Type
        </p>

        {/* ── Heading ── */}
        <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-[42px]">
          Choose a blood group
        </h2>

        {/* ── Subtitle ── */}
        <p className="mt-2.5 text-[16.5px] leading-relaxed text-[#9E8E85]">
          Start with the blood group you need, then narrow the search by area.
        </p>

        {/* ── Blood Group Pills ── */}
       <div className="mt-8 flex flex-wrap gap-4 w-full">
  {BLOOD_GROUPS.map((group) => {
    const isSelected = selected === group;
    return (
      <button
        key={group}
        onClick={() => setSelected(isSelected ? null : group)}
        className={[
          "h-[64px] min-w-[74px] rounded-[16px] border px-7",
          "text-[16px] font-semibold",
          "transition-all duration-200 ease-out",
          "focus:outline-none",
          isSelected
            ? [
                "border-[#E2484D] bg-[#E2484D] text-white",
                "shadow-[0_6px_18px_rgba(226,72,77,0.28)]",
                "scale-[1.04]",
              ].join(" ")
            : [
                "border-[#E7E0DB] bg-white text-[#1B1615]",
                "hover:border-[#E2484D]/40",
                "hover:shadow-[0_4px_12px_rgba(27,22,21,0.07)]",
                "hover:-translate-y-[1px]",
              ].join(" "),
        ].join(" ")}
      >
        {group}
      </button>
    );
  })}
</div>

        {/* ── Selection hint ── */}
        {selected && (
          <p className="mt-5 text-1xl text-[#9E8E85]">
            Searching for{" "}
            <span className="font-semibold text-[#E2484D]">{selected}</span>
            {" "}donors —{" "}
            <button
              onClick={() => setSelected(null)}
              className="underline underline-offset-2 transition-colors hover:text-[#1B1615]"
            >
              clear
            </button>
          </p>
        )}

      </div>
    </section>
  );
};

export default ChooseBloodGroup;