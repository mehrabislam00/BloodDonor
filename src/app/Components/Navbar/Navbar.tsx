"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Find Donor", href: "/" },
    { label: "Become a Donor", href: "/Become_A_Donor" },
    { label: "About", href: "/About" },
  ];

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b
        bg-[#FDF9F6]
        backdrop-blur-xl
        border-b-[#E6E0DB]
      "
     
    >
      <div className="navbar container mx-auto min-h-[76px] px-4 sm:px-6">

        {/* Logo */}
        <div className="navbar-start">
          <Link
            href="/"
            aria-label="BloodDonor Home"
            className="
              group
              flex
              items-center
              gap-2.5
              transition-transform
              duration-200
              hover:scale-[1.03]
            "
          >
            {/* Blood Drop Icon */}
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
              <svg
                viewBox="0 0 40 48"
                className="
                  h-11
                  w-10
                  fill-[#E2484D]
                  transition-transform
                  duration-300
                  group-hover:scale-110
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

                {/* Small white highlight */}
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

            {/* Text Logo */}
            <span className="text-xl font-bold tracking-[-0.04em]">
              <span className="text-base-content text-[#1B1615] font-Link">Blood</span>
              <span className="text-[#E2484D]">
                Donor
              </span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      group
                      relative
                      inline-flex
                      py-3
                      text-sm
                      font-semibold
                      transition-colors
                      duration-200
                      ${
                        active
                          ? "text-[#E2484D]"
                          : "text-base-content/70 hover:text-[#E2484D]"
                      }
                    `}
                  >
                    {item.label}

                    <span
                      className={`
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        rounded-full
                        bg-[#E2484D]
                        transition-all
                        duration-300
                        ${
                          active
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      
{/* Right */}
<div className="navbar-end gap-2.5">
  {/* Login */}
  <Link href="/signin">
    <Button
      variant="ghost"
      className="

        rounded-lg
        px-4
        py-5
        text-sm
        font-medium
        text-[#1B1615]
        transition-all
        duration-300
        hover:bg-red-50
        hover:text-[#E2484D]
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
        rounded-lg
        border border-[#E2484D]/20
        bg-[#E2484D]
        px-5
        py-5
        text-sm
        font-medium
        text-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:bg-[#D83E43]
        hover:shadow-md
        active:translate-y-0
        active:scale-[0.98]
      "
    >
      Become a Donor
    </Button>
  </Link>
</div>


      </div>
    </nav>
  );
};

export default Navbar;