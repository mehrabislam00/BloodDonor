import React from "react";
import {
  Scale, Users, FileCheck,
  Stethoscope, Lock, RefreshCw,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────────
const TERMS = [
  {
    icon:  Scale,
    title: "Platform purpose",
    body:  "BloodDonor helps blood seekers and potential donors connect. It is not a medical service and does not provide medical advice.",
  },
  {
    icon:  Users,
    title: "User responsibility",
    body:  "Users must communicate respectfully, contact donors only for genuine needs, and use shared information responsibly.",
  },
  {
    icon:  FileCheck,
    title: "Information accuracy",
    body:  "Donors are responsible for keeping their blood group, area, availability, activity, and contact details accurate.",
  },
  {
    icon:  Stethoscope,
    title: "Availability and eligibility",
    body:  "BloodDonor does not guarantee that a donor is available or medically eligible. All parties must confirm suitability through qualified medical professionals.",
  },
  {
    icon:  Lock,
    title: "Privacy of donors",
    body:  "Only public profile details are shared. Exact home addresses are never displayed. Contact information is visible solely to registered users.",
  },
  {
    icon:  RefreshCw,
    title: "Changes to these terms",
    body:  "We may update these terms as the platform evolves. Continued use after any update means you accept the revised terms.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────
const TermsPage = () => {
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
            <Scale size={12} strokeWidth={2.5} className="text-[#E2484D]" />
            <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#E2484D]">
              BloodDonor Policies
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-lg text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#1B1615] sm:text-[56px]">
            Terms of{" "}
            <span className="bg-gradient-to-r from-[#E2484D] via-[#D83E43] to-[#B92F35] bg-clip-text text-transparent">
              Use
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#9E8E85]">
            Simple terms for using BloodDonor responsibly.
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
              <FileCheck size={16} strokeWidth={2} />
            </div>
            <p className="text-[13.5px] leading-relaxed text-[#68625E]">
              By using{" "}
              <span className="font-semibold text-[#1B1615]">BloodDonor</span>,
              you agree to the following terms. Please read them carefully
              before registering or contacting a donor.
            </p>
          </div>

          {/* Terms grid */}
          <div className="
            grid grid-cols-1 overflow-hidden
            rounded-[18px] border border-[#E7E0DB]
            bg-[#E7E0DB]
            shadow-[0_6px_32px_rgba(27,22,21,0.06)]
            gap-px
            sm:grid-cols-2
          ">
            {TERMS.map(({ icon: Icon, title, body }, i) => (
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
                  <span className="
                    text-[11px] font-bold
                    tracking-[0.14em] text-[#DDD6D1]
                  ">
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

                {/* Bottom accent line */}
                <div className="
                  mt-auto h-px w-0 bg-gradient-to-r from-[#E2484D]/40 to-transparent
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

export default TermsPage;