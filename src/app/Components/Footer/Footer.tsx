// src/app/Components/Home/Footer/Footer.tsx

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#E7E0DB] bg-[#faf4f0]">
      <div className="container mx-auto w-full  px-4 sm:px-6 lg:px-15">

        {/* ── Main footer row ── */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24">

          {/* ── Brand column ── */}
          <div className="max-w-sm">
            {/* Logo */}
            <Link
            href="/"
            aria-label="BloodDonor Home"
            className="
              group
              flex
              items-center
              gap-2.5
              rounded-xl
              transition-all
              duration-300
              ease-out
              hover:-translate-y-px
            "
          >
            {/* Blood Drop */}
            <span
              className="
                relative
                flex
                h-11
                w-10
                items-center
                justify-center
              "
            >
              {/* Soft glow */}
              <span
                className="
                  absolute
                  h-8
                  w-8
                  rounded-full
                  bg-[#E2484D]/0
                  blur-xl
                  transition-all
                  duration-500
                  group-hover:bg-[#E2484D]/30
                "
              />

              <svg
                viewBox="0 0 40 48"
                className="
                  relative
                  h-11
                  w-10
                  fill-[#E2484D]
                  transition-all
                  duration-500
                  ease-out
                  group-hover:scale-110
                  group-hover:-rotate-3
                "
                aria-hidden="true"
              >
                <path
                  d="
                    M20 2
                    C20 2 4 19 4 30
                    C4 39.5 11.2 46 20 46
                    C28.8 46 36 39.5 36 30
                    C36 19 20 2 20 2Z
                  "
                />

                {/* Highlight */}
                <path
                  d="
                    M13 28
                    C13 23 17 17 19 14
                    C15 20 12 24 12 29
                    C12 31 13 33 15 34
                    C13.7 32.5 13 30.5 13 28Z
                  "
                  fill="white"
                  opacity="0.35"
                />
              </svg>
            </span>

            {/* Logo Text */}
            <span
              className="
                text-xl
                font-bold
                tracking-[-0.04em]
                transition-all
                duration-300
              "
            >
              <span
                className="
                  font-medium
                  text-[#1B1615]
                  transition-colors
                  duration-300
                  group-hover:text-[#2B2523]
                "
              >
                Blood
              </span>

              <span
                className="
                  font-medium
                  text-[#E2484D]
                  transition-colors
                  duration-300
                  group-hover:text-[#C9363C]
                "
              >
                Donor
              </span>
            </span>
          </Link>

            {/* Tagline */}
            <p className="mt-4 text-[14.5px] leading-relaxed text-[#9E8E85]">
              Helping people across Dhaka find active blood donors with
              clarity, care, and respect.
            </p>
          </div>

          {/* ── Nav columns ── */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:flex sm:justify-end sm:gap-20">

            {/* Explore */}
            <div>
              <h2 className="mb-4 text-[13px] font-bold text-[#1B1615]">
                Explore
              </h2>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Find Donor",       href: "/Find_A_Doner"   },
                  { label: "Become a Donor",   href: "/Become_A_Donor" },
                  { label: "About",            href: "/About"          },
                  { label: "Login",            href: "/Login"          },
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
              <h2 className="mb-4 text-[13px] font-bold text-[#1B1615]">
                Legal
              </h2>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Privacy", href: "/Privacy" },
                  { label: "Terms",   href: "/Terms"   },
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
        <div className="border-t border-[#E7E0DB] py-6 sm:py-7">
          <p className="mx-auto max-w-2xl text-center text-[12.5px] leading-relaxed text-[#9E8E85]">
            This platform helps connect{" "}
            <span className="text-[#68625E]">blood seekers</span> with donors.
            It does not provide{" "}
            <span className="text-[#68625E]">medical advice</span> or guarantee
            donor{" "}
            <span className="text-[#68625E]">eligibility</span> or{" "}
            <span className="text-[#68625E]">availability</span>.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;