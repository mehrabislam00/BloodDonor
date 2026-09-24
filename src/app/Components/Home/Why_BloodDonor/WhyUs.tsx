import React from "react";
import Link from "next/link";
import { Search, Users, MessageCircle, ShieldCheck } from "lucide-react";

// ── Feature data ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Search,
    title: "Simple Search",
    description: "Find donors by blood group and area.",
  },
  {
    icon: Users,
    title: "Active Donors",
    description: "See who has recently been active.",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description: "Call or message donors directly.",
  },
  {
    icon: ShieldCheck,
    title: "Community Driven",
    description: "Information shaped by a caring community.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

const WhyUs = () => {
  return (
    <section className="w-full bg-[#FAF7F4] py-16 sm:py-20 ">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-10 ">
      
        {/* ── Badge ── */}
        <p className="mb-4 text-center text-1xl font-bold uppercase tracking-[0.18em] text-[#E2484D]">
          Why BloodDonor
        </p>

        {/* ── Heading ── */}
        <h2 className="mx-auto max-w-3xl text-center text-[34px] font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-[42px]">
          Built around people helping people.
        </h2>

        {/* ── Features grid ── */}
        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 ">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex flex-col gap-4 pl-8">
                {/* Icon box */}
                <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#FFE4E4] text-[#E2484D]  ">
                  <Icon size={18} strokeWidth={2} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-[14px] font-bold text-[#1B1615]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#9E8E85]">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA Banner ── */}
        <div
          className="
            mt-16 rounded-[20px] bg-[#E2484D]
            px-8 py-10 sm:px-12 sm:py-12
            shadow-[0_20px_50px_rgba(226,72,77,0.22)]
          "
        >
          {/* Heading */}
          <h3 className="max-w text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[32px]">
            Someone nearby may be able to help.
          </h3>

          {/* Description */}
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-white/75">
            Keep your donor profile updated and make it easier for someone to
            find you when they need blood.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/Become_A_Donor"
              className="
                flex h-[42px] items-center rounded-[10px]
                bg-white px-5 text-[13px] font-semibold text-[#E2484D]
                transition-all duration-200
                hover:bg-[#FFF0F0]
                hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]
                active:scale-[0.98]
              "
            >
              Become a Donor
            </Link>
            <Link
              href="/Find_A_Doner"
              className="
                flex h-[42px] items-center rounded-[10px]
                border border-white/40 bg-white/10 px-5
                text-[13px] font-semibold text-white
                backdrop-blur-sm
                transition-all duration-200
                hover:bg-white/20
                hover:border-white/60
                active:scale-[0.98]
              "
            >
              Find a Donor
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyUs;