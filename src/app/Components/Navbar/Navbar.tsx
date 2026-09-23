"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import logo from "@/app/Assets/logo.png";

const Navbar = () => {
  const pathname = usePathname();

  const links = (
    <>
      {/* Find Donor */}
      <li>
        <Link
          href="/"
          className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
            pathname === "/"
              ? "border border-primary text-primary"
              : "text-base-content hover:text-primary"
          }`}
        >
          Find Donor
        </Link>
      </li>

      {/* Become a Donor */}
      <li>
        <Link
          href="/Become_A_Donor"
          className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
            pathname === "/Become_A_Donor"
              ? "border border-primary text-primary"
              : "text-base-content hover:text-primary"
          }`}
        >
          Become a Donor
        </Link>
      </li>

      {/* About */}
      <li>
        <Link
          href="/About"
          className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
            pathname === "/About"
              ? "border border-primary text-primary"
              : "text-base-content hover:text-primary"
          }`}
        >
          About
        </Link>
      </li>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-base-200 bg-base-100">
      <div className="navbar container mx-auto min-h-[72px] px-4 sm:px-6">

        {/* Logo */}
        <div className="navbar-start">
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost mr-2 lg:hidden"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[1] mt-3 w-52 rounded-xl border border-base-200 bg-base-100 p-3 shadow-lg"
            >
              {links}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={logo}
              alt="BloodDonor logo"
              width={36}
              height={36}
              priority
            />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-base-content">Blood</span>
              <span className="text-primary">Donor</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-6">
            {links}
          </ul>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-end gap-4">
          <Link
            href="/signin"
            className="text-sm font-medium text-base-content transition-colors hover:text-primary"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="btn btn-primary rounded-full px-5 text-sm font-semibold"
          >
            Become a Donor
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;