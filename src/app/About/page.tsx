import React from "react";
import { Heart, Search, ShieldCheck } from "lucide-react";
import Footer from "@/app/Components/Home/Footer/Footer";

// ── Feature data ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Heart,
    title: "Our Purpose",
    description:
      "BloodDonor helps people find willing donors without turning a difficult moment into a complicated search.",
  },
  {
    icon: Search,
    title: "How It Works",
    description:
      "Search by blood group and area, review recent activity, then contact a donor directly.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Safety",
    description:
      "We share only useful public profile details and never display a donor's exact home address.",
  },
];

// ── About Page ────────────────────────────────────────────────────────────

const About = () => {
  return (
    <main className="w-full">

      {/* ══════════════════════════════════════════
          Section 1 — Hero / Intro
      ══════════════════════════════════════════ */}
      <section className="w-full bg-[#f9f4f0] py-16 sm:py-24">
        <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Badge */}
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[#E2484D]">
            About Us
          </p>

          {/* Heading */}
          <h1 className="max-w-2xl text-[38px] font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-[56px]">
            Making it easier to find help when it matters.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#9E8E85]">
            BloodDonor is a simple platform designed to connect people looking
            for blood with available donors in Dhaka.
          </p>

          {/* ── Divider + Features ── */}
          <div className="mt-14 border-t border-[#E7E0DB]">
            <div className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-3 sm:gap-0">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={[
                      "flex flex-col gap-4",
                      i < FEATURES.length - 1
                        ? "sm:border-r sm:border-[#E7E0DB] sm:pr-10"
                        : "",
                      i > 0 ? "sm:pl-10" : "",
                    ].join(" ")}
                  >
                    {/* Icon box */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FFE4E4] text-[#E2484D]">
                      <Icon size={18} strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <h2 className="text-[15px] font-bold text-[#1B1615]">
                      {feature.title}
                    </h2>

                    {/* Description */}
                    <p className="text-[13.5px] leading-relaxed text-[#9E8E85]">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 2 — Contact
      ══════════════════════════════════════════ */}
      <section className="w-full border-t border-[#E7E0DB] bg-[#FAF7F4] py-14 sm:py-16">
        <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <h2 className="text-[22px] font-bold text-[#1B1615]">
            Contact
          </h2>

          {/* Body */}
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#9E8E85]">
            Questions about the{" "}
            <span className="text-[#E2484D]">platform</span>? Reach the
            BloodDonor community support team through the contact details
            provided{" "}
            <span className="text-[#E2484D]">after launch</span>.
          </p>

        </div>
      </section>

      <Footer />

    </main>
  );
};

export default About;