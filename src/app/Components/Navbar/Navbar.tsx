
"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Find Donor", href: "/Find_A_Doner" },
    { label: "Become a Donor", href: "/Become_A_Donor" },
    { label: "About", href: "/About" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-[#E6E0DB]/80
        bg-[#FDF9F6]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          navbar
          container
          mx-auto
          min-h-[76px]
          w-full
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ==================== LOGO ==================== */}
        <div className="navbar-start">
          <Link
            href="/"
            aria-label="BloodDonor Home"
            onClick={closeMenu}
            className="
              group
              flex
              items-center
              gap-2.5
              rounded-xl
              transition-all
              duration-300
              ease-out
              hover:-translate-y-[1px]
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
                  group-hover:rotate-[-3deg]
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
        </div>

        {/* ==================== DESKTOP NAVIGATION ==================== */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      group
                      relative
                      flex
                      items-center
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      ease-out

                      ${
                        active
                          ? `
                            bg-[#FFE8E8]
                            text-[#E2484D]
                            shadow-sm
                          `
                          : `
                            text-[#68625E]
                            hover:bg-[#FFF0F0]
                            hover:text-[#E2484D]
                          `
                      }
                    `}
                  >
                    {item.label}

                    {/* Animated underline */}
                    <span
                      className={`
                        absolute
                        bottom-[5px]
                        left-1/2
                        h-[2px]
                        -translate-x-1/2
                        rounded-full
                        bg-[#E2484D]
                        transition-all
                        duration-300
                        ease-out

                        ${
                          active
                            ? "w-5 opacity-100"
                            : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                        }
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ==================== DESKTOP ACTIONS ==================== */}
        <div className="navbar-end hidden gap-2.5 lg:flex">
          {/* Login */}
          <Link href="/signin">
            <Button
              variant="ghost"
              className="
                h-11
                rounded-xl
                border
                border-transparent
                px-5
                text-sm
                font-semibold
                text-[#1B1615]
                transition-all
                duration-300
                ease-out

                hover:-translate-y-[1px]
                hover:border-[#E2484D]/10
                hover:bg-[#FFE8E8]
                hover:text-[#E2484D]

                active:translate-y-0
                active:scale-[0.98]
              "
            >
              Login
            </Button>
          </Link>

          {/* Become a Donor */}
          <Link href="/signup">
            <Button
              className="
                h-11
                rounded-xl
                border
                border-[#E2484D]/20
                bg-[#E2484D]
                px-5
                text-sm
                font-semibold
                text-white

                shadow-[0_6px_18px_rgba(226,72,77,0.18)]

                transition-all
                duration-300
                ease-out

                hover:-translate-y-[2px]
                hover:border-[#D83E43]
                hover:bg-[#D83E43]
                hover:shadow-[0_10px_25px_rgba(226,72,77,0.28)]

                active:translate-y-0
                active:scale-[0.98]
                active:shadow-sm
              "
            >
              Become a Donor
              <span
                className="
                  ml-1
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Button>
          </Link>
        </div>

        {/* ==================== MOBILE MENU BUTTON ==================== */}
        <div className="navbar-end lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-transparent
              text-[#1B1615]

              transition-all
              duration-300

              hover:border-[#E2484D]/10
              hover:bg-[#FFE8E8]
              hover:text-[#E2484D]

              active:scale-95
            "
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ==================== MOBILE MENU ==================== */}
      <div
        className={`
          overflow-hidden
          border-t
          border-[#E6E0DB]
          bg-[#FDF9F6]
          transition-all
          duration-300
          ease-out
          lg:hidden

          ${
            isMenuOpen
              ? "max-h-[450px] opacity-100"
              : "max-h-0 border-t-0 opacity-0"
          }
        `}
      >
        <div className="container mx-auto px-4 py-4 sm:px-6">
          {/* Mobile Navigation */}
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          bg-[#FFE8E8]
                          text-[#E2484D]
                        `
                        : `
                          text-[#1B1615]
                          hover:bg-[#FFF0F0]
                          hover:text-[#E2484D]
                        `
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="mt-4 flex gap-2.5 border-t border-[#E6E0DB] pt-4">
            <Link
              href="/signin"
              onClick={closeMenu}
              className="flex-1"
            >
              <Button
                variant="ghost"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[#1B1615]/10
                  text-sm
                  font-semibold
                  text-[#1B1615]
                  transition-all
                  duration-300

                  hover:border-[#E2484D]/10
                  hover:bg-[#FFE8E8]
                  hover:text-[#E2484D]
                "
              >
                Login
              </Button>
            </Link>

            <Link
              href="/signup"
              onClick={closeMenu}
              className="flex-1"
            >
              <Button
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[#E2484D]/20
                  bg-[#E2484D]
                  text-sm
                  font-semibold
                  text-white

                  shadow-[0_6px_18px_rgba(226,72,77,0.18)]

                  transition-all
                  duration-300

                  hover:-translate-y-[1px]
                  hover:bg-[#D83E43]
                  hover:shadow-[0_10px_22px_rgba(226,72,77,0.25)]

                  active:translate-y-0
                "
              >
                Become a Donor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

