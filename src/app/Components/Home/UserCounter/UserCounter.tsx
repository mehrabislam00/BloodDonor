import React from "react";
import { NumberTicker } from "@/registry/magicui/number-ticker";

const STATS = [
  { value: 1200, suffix: "+", label: "Registered Donors", accent: false },
  { value: 600,  suffix: "+", label: "Active Donors",     accent: false },
  { value: 20,   suffix: "+", label: "Dhaka Areas",       accent: true  },
  { value: 1900, suffix: "+", label: "People Connected",  accent: false },
];

const UserCounter = () => {
  return (
    <section className="w-full  border-t-2 border-b-2 border-[#E6E0DB] bg-[#fcf8f5] px-4  sm:px-6  py-20">


<div className="container mx-auto">
   {/* ── Badge ── */}
      <p className="mb-5 text-center text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[#B5A89F]">
        Our Donor Community
      </p>

      {/* ── Grid ── */}
      <div className="mx-auto w-full  border-y border-[#E7E0DB]">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "flex flex-col items-center justify-center gap-1.5 py-9 px-6",
                i % 2 === 0          ? "border-r border-[#E7E0DB]"               : "",
                i < 2                ? "border-b border-[#E7E0DB] lg:border-b-0" : "",
                i < STATS.length - 1 ? "lg:border-r border-[#E7E0DB]"            : "lg:border-r-0",
              ].join(" ")}
            >
              {/* Number + suffix */}
              <div className="flex items-baseline gap-0.5 leading-none">
                <NumberTicker
                  value={stat.value}
                  className="text-[30px] font-bold tracking-[-0.03em] text-[#1B1615] sm:text-[34px]"
                />
                <span className="text-[30px] font-bold tracking-[-0.03em] text-[#1B1615] sm:text-[34px]">
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <span
                className={[
                  "text-[12.5px] font-medium",
                  stat.accent ? "text-[#9E8E85]" : "text-[#9E8E85]",
                ].join(" ")}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>


</div>
   
    </section>
  );
};

export default UserCounter;