import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { Mail } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/support";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#E7E0DB] bg-[#faf4f0]">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* ── Main footer row ── */}
        <div className="grid grid-cols-1 gap-8 py-9 sm:py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">

          {/* ── Brand column ── */}
          <div className="max-w-sm">
            <BrandLogo />

            <p className="mt-3 text-[14px] leading-relaxed text-[#9E8E85]">
              Helping people across Dhaka find active blood donors with
              clarity, care, and respect.
            </p>

            {/* ── Contact email ── */}
           {/* ── Contact email ── */}
<div className="mt-4 flex items-center gap-2 text-[13.5px] text-[#9E8E85]">
  <Mail size={13} strokeWidth={2} className="shrink-0 text-[#C5B8B0]" />
  <a
    href={`mailto:${SUPPORT_EMAIL}`}
    className="
      font-medium text-[#68625E]
      underline underline-offset-2 decoration-[#DDD6D1]
      transition-all duration-150
      hover:text-[#E2484D] hover:decoration-[#E2484D]/40
      focus-visible:outline-2 focus-visible:outline-offset-2
      focus-visible:outline-[#E2484D]
    "
  >
    {SUPPORT_EMAIL}
  </a>
</div>
          </div>

          {/* ── Nav columns ── */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:flex sm:justify-end sm:gap-16">

            {/* Explore */}
            <div>
              <h2 className="mb-3 text-[13px] font-bold text-[#1B1615]">
                Explore
              </h2>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: "Find Donor",     href: "/find-a-donor"   },
                  { label: "Become a Donor", href: "/become-a-donor" },
                  { label: "About",          href: "/about"           },
                  { label: "Login",          href: "/login"           },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="inline-flex rounded-md text-[14px] text-[#68625E] transition-all duration-150 hover:-translate-y-px hover:text-[#E2484D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2484D]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h2 className="mb-3 text-[13px] font-bold text-[#1B1615]">
                Legal
              </h2>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms",   href: "/terms"   },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="inline-flex rounded-md text-[14px] text-[#68625E] transition-all duration-150 hover:-translate-y-px hover:text-[#E2484D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2484D]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="
          flex flex-col items-center gap-1.5
          border-t border-[#E7E0DB] py-4
          sm:flex-row sm:justify-between sm:py-5
        ">
          <p className="text-center text-[12.5px] leading-relaxed text-[#9E8E85] sm:text-left">
            This platform helps connect{" "}
            <span className="text-[#68625E]">blood seekers</span> with donors.
            It does not provide{" "}
            <span className="text-[#68625E]">medical advice</span> or guarantee
            donor <span className="text-[#68625E]">eligibility</span> or{" "}
            <span className="text-[#68625E]">availability</span>.
          </p>
          <p className="shrink-0 text-[12px] text-[#C5B8B0]">
            © {new Date().getFullYear()} BloodDonor
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;