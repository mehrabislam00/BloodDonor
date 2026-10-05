"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search, HeartHandshake, HelpCircle } from "lucide-react";
import { BloodDropMark } from "@/components/layout/BrandLogo";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-76px)] w-full flex-col items-center justify-center overflow-hidden bg-[#FDF9F6] px-4 py-16 sm:px-6 sm:py-24 dark:bg-background">
      {/* ── Ambient Background Glows ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[650px] sm:w-[650px]"
        style={{
          background: "radial-gradient(circle, rgba(226,72,77,0.08) 0%, rgba(226,72,77,0.02) 45%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full sm:h-[450px] sm:w-[450px]"
        style={{
          background: "radial-gradient(circle, rgba(226,72,77,0.05) 0%, transparent 65%)",
        }}
      />

      {/* ── Subtle Dot Grid Texture ── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-60 dark:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="not-found-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="rgba(226,72,77,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#not-found-dots)" />
      </svg>

      {/* ── Decorative Subtle Rings ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[580px] sm:w-[580px]"
        style={{ border: "1px solid rgba(226,72,77,0.06)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[720px] sm:w-[720px]"
        style={{ border: "1px solid rgba(226,72,77,0.03)" }}
      />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Thematic Icon Badge */}
        <div className="relative mb-6 flex items-center justify-center">
          <span className="absolute h-16 w-16 animate-ping rounded-full bg-[#E2484D]/10 motion-reduce:animate-none" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EDE7E2] bg-white/80 shadow-[0_8px_24px_rgba(226,72,77,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-card/80">
            <BloodDropMark className="h-7 w-6 animate-subtle-bob fill-[#E2484D] motion-reduce:animate-none" />
          </span>
        </div>

        {/* Status Pill Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2484D]/15 bg-[#FFE8E8] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#E2484D] dark:bg-[#E2484D]/15">
          <span className="h-2 w-2 rounded-full bg-[#E2484D] animate-pulse" />
          Error 404 • Page Not Found
        </div>

        {/* Prominent 404 Number */}
        <h1 className="text-7xl font-black tracking-[-0.04em] text-[#1B1615] sm:text-8xl md:text-9xl dark:text-white">
          4<span className="bg-linear-to-r from-[#E2484D] via-[#D83E43] to-[#B92F35] bg-clip-text text-transparent">0</span>4
        </h1>

        {/* Headings & Friendly Explanation */}
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1B1615] sm:text-3xl dark:text-[#F8F5F2]">
          Looks like this page doesn&apos;t exist
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#68625E] sm:text-base dark:text-[#A79D96]">
          The link you followed may be broken or the page may have been moved.
          Don&apos;t worry—our community of blood donors is always within reach.
        </p>

        {/* ── Primary Action Buttons ── */}
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleGoBack}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#EDE7E2] bg-white/80 px-6 text-sm font-semibold text-[#1B1615] shadow-xs backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E2484D]/30 hover:bg-[#FFE8E8] hover:text-[#E2484D] active:translate-y-0 active:scale-[0.98] dark:border-white/10 dark:bg-card/70 dark:text-white dark:hover:bg-[#E2484D]/15 dark:hover:text-[#E2484D]"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>

          <Link href="/" className="inline-flex">
            <button
              type="button"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E2484D] bg-[#E2484D] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(226,72,77,0.20)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#D83E43] hover:shadow-[0_12px_28px_rgba(226,72,77,0.28)] active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              <Home className="size-4" />
              <span>Back to Home</span>
            </button>
          </Link>
        </div>

        {/* ── Quick Navigation Section ── */}
        <div className="mt-12 w-full border-t border-[#EDE7E2]/70 pt-8 dark:border-white/10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#9E8E85] dark:text-muted-foreground">
            Looking for something specific?
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/find-a-donor"
              className="group flex flex-col items-center rounded-2xl border border-[#EDE7E2] bg-white/60 p-4 text-center backdrop-blur-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#E2484D]/30 hover:bg-white hover:shadow-[0_10px_25px_rgba(27,22,21,0.06)] dark:border-white/10 dark:bg-card/40 dark:hover:bg-card"
            >
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE4E4] text-[#E2484D] transition-transform duration-300 group-hover:scale-110 dark:bg-[#E2484D]/20">
                <Search className="size-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1B1615] group-hover:text-[#E2484D] dark:text-white">
                Find a Donor
              </h3>
              <p className="mt-1 text-xs text-[#9E8E85] dark:text-muted-foreground">
                Search donors by blood group & area
              </p>
            </Link>

            <Link
              href="/become-a-donor"
              className="group flex flex-col items-center rounded-2xl border border-[#EDE7E2] bg-white/60 p-4 text-center backdrop-blur-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#E2484D]/30 hover:bg-white hover:shadow-[0_10px_25px_rgba(27,22,21,0.06)] dark:border-white/10 dark:bg-card/40 dark:hover:bg-card"
            >
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE4E4] text-[#E2484D] transition-transform duration-300 group-hover:scale-110 dark:bg-[#E2484D]/20">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1B1615] group-hover:text-[#E2484D] dark:text-white">
                Become a Donor
              </h3>
              <p className="mt-1 text-xs text-[#9E8E85] dark:text-muted-foreground">
                Register to help save lives in Dhaka
              </p>
            </Link>

            <Link
              href="/about"
              className="group flex flex-col items-center rounded-2xl border border-[#EDE7E2] bg-white/60 p-4 text-center backdrop-blur-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#E2484D]/30 hover:bg-white hover:shadow-[0_10px_25px_rgba(27,22,21,0.06)] dark:border-white/10 dark:bg-card/40 dark:hover:bg-card"
            >
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE4E4] text-[#E2484D] transition-transform duration-300 group-hover:scale-110 dark:bg-[#E2484D]/20">
                <HelpCircle className="size-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1B1615] group-hover:text-[#E2484D] dark:text-white">
                About & Help
              </h3>
              <p className="mt-1 text-xs text-[#9E8E85] dark:text-muted-foreground">
                Learn how BloodDonor works
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
