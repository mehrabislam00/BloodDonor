import React from "react";
import {
  Database,
  Target,
  Eye,
  RefreshCw,
  Lock,
  Mail,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────────
const POLICIES = [
  {
    icon:  Database,
    title: "Information we collect",
    body:  "We collect account and donor profile details such as name, contact information, blood group, general area, availability, and donation date.",
  },
  {
    icon:  Target,
    title: "Why we collect it",
    body:  "This information helps blood seekers discover relevant donors and helps donors keep their public availability accurate.",
  },
  {
    icon:  Eye,
    title: "What is publicly visible",
    body:  "A donor's name, blood group, general area, availability, recent activity, and donation timing may be visible. Exact home addresses are never shown.",
  },
  {
    icon:  RefreshCw,
    title: "Updates and reports",
    body:  "Users can update their profile information at any time. Community reports are reviewed for accuracy and safety and are never displayed publicly.",
  },
  {
    icon:  Lock,
    title: "How we protect your data",
    body:  "All data is stored securely. We do not sell, rent, or share personal information with third parties outside of what is required to operate the platform.",
  },
  {
    icon:  Mail,
    title: "Contact & data requests",
    body:  "To request deletion or correction of your data, contact us at support@blooddonor.com. We will respond within a reasonable timeframe.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────
const PrivacyPage = () => {
  return (
    <main className="w-full">

      {/* ══════════════════════════════════
          Hero
      ══════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#F9F4F0] py-16 sm:py-24">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E2484D]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-48 w-48 rounded-full bg-[#E2484D]/4 blur-2xl" />

        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E2484D]/15 bg-[#FFE8E8] px-4 py-1.5">
            <Lock size={12} strokeWidth={2.5} className="text-[#E2484D]" />
            <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#E2484D]">
              BloodDonor Policies
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-lg text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#1B1615] sm:text-[56px]">
            Privacy{" "}
            <span className="bg-gradient-to-r from-[#E2484D] via-[#D83E43] to-[#B92F35] bg-clip-text text-transparent">
              Policy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#9E8E85]">
            A clear overview of how donor information is used and protected.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════
          Content
      ══════════════════════════════════ */}
      <section className="w-full border-t border-[#E7E0DB] bg-[#FAF7F4]">
        <div className="container mx-auto w-full px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

          {/* Intro card */}
          <div className="
            mb-10 flex items-start gap-4
            rounded-[14px] border border-[#E7E0DB]
            bg-white px-5 py-4
            shadow-[0_4px_20px_rgba(27,22,21,0.05)]
            sm:items-center
          ">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#FFE4E4] text-[#E2484D]">
              <Lock size={16} strokeWidth={2} />
            </div>
            <p className="text-[13.5px] leading-relaxed text-[#68625E]">
              Your privacy matters to{" "}
              <span className="font-semibold text-[#1B1615]">BloodDonor</span>.
              We only collect what is necessary to connect donors with people in
              need. We never sell your data.
            </p>
          </div>

          {/* Policy grid */}
          <div className="
            grid grid-cols-1 overflow-hidden
            rounded-[18px] border border-[#E7E0DB]
            bg-[#E7E0DB] gap-px
            shadow-[0_6px_32px_rgba(27,22,21,0.06)]
            sm:grid-cols-2
          ">
            {POLICIES.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="
                  group flex flex-col gap-4 bg-white
                  px-6 py-7
                  transition-colors duration-200
                  hover:bg-[#FFFAF9]
                "
              >
                {/* Icon + number */}
                <div className="flex items-center justify-between">
                  <div className="
                    flex h-10 w-10 items-center justify-center
                    rounded-[11px] bg-[#FFE4E4] text-[#E2484D]
                    transition-all duration-200
                    group-hover:bg-[#E2484D] group-hover:text-white
                  ">
                    <Icon size={17} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.14em] text-[#DDD6D1]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[15px] font-bold text-[#1B1615]">
                  {title}
                </h2>

                {/* Body */}
                <p className="text-[13.5px] leading-[1.75] text-[#9E8E85]">
                  {body}
                </p>

                {/* Hover accent line */}
                <div className="
                  mt-auto h-px w-0 bg-gradient-to-r
                  from-[#E2484D]/40 to-transparent
                  transition-all duration-300
                  group-hover:w-full
                " />
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="
            mt-10 flex flex-col gap-3
            rounded-[14px] border border-[#E7E0DB]
            bg-white px-5 py-5
            shadow-[0_2px_12px_rgba(27,22,21,0.04)]
            sm:flex-row sm:items-center sm:justify-between
          ">
            <div className="flex flex-col gap-0.5">
              <p className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-[#C5B8B0]">
                Last updated
              </p>
              <p className="text-[13.5px] text-[#9E8E85]">
                This policy was last reviewed in{" "}
                <span className="font-semibold text-[#68625E]">2026</span>.
              </p>
            </div>

            <div className="flex flex-col gap-0.5 sm:items-end">
              <p className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-[#C5B8B0]">
                Questions?
              </p>
              <a
                href="mailto:support@blooddonor.com"
                className="
                  text-[13.5px] font-medium text-[#E2484D]
                  transition-colors duration-150
                  hover:text-[#C73E43] hover:underline
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[#E2484D]
                "
              >
                support@blooddonor.com
              </a>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default PrivacyPage;