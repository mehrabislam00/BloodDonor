// components/loading/PageLoader.tsx

import React from "react";
import { BloodDropMark } from "@/components/layout/BrandLogo";

// ── Spinner — use anywhere inline ─────────────────────────────────────────────
export function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="relative flex shrink-0 items-center justify-center"
    >
      {/* Outer ring */}
      <span
        style={{ width: size, height: size }}
        className="
          absolute rounded-full
          border-[2px] border-[#E2484D]/15 dark:border-[#E2484D]/25
        "
      />

      {/* Spinning arc */}
      <span
        style={{ width: size, height: size }}
        className="
          absolute animate-spin rounded-full
          border-[2px] border-transparent
          border-t-[#E2484D]
          motion-reduce:animate-none
        "
      />
    </span>
  );
}

// ── Blood drop — thematic pulsing icon ────────────────────────────────────────
function BloodDrop() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings */}
      <span className="absolute h-16 w-16 animate-ping rounded-full bg-[#E2484D]/8 dark:bg-[#E2484D]/15 motion-reduce:animate-none" />
      <span className="absolute h-12 w-12 animate-ping rounded-full bg-[#E2484D]/12 dark:bg-[#E2484D]/20 [animation-delay:180ms] motion-reduce:animate-none" />

      {/* Drop badge */}
      <span className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-[#E2484D]/20 bg-linear-to-b from-[#FFF5F5] to-[#FFE4E4] shadow-[0_4px_16px_rgba(226,72,77,0.18)] dark:from-[#E2484D]/25 dark:to-[#E2484D]/10">
        <BloodDropMark className="h-6.5 w-5.5 animate-subtle-bob fill-[#E2484D] motion-reduce:animate-none" />
      </span>
    </div>
  );
}

// ── Loading dots — subtle animated ellipsis ───────────────────────────────────
function LoadingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="
            h-1 w-1 rounded-full
            bg-[#E2484D]
            animate-subtle-bounce
            motion-reduce:animate-none
          "
        />
      ))}
    </span>
  );
}

// ── PageLoader ─────────────────────────────────────────────────────────────────
interface PageLoaderProps {
  fullPage?: boolean;
  message?: string;
  subMessage?: string;
}

export default function PageLoader({
  fullPage = false,
  message = "Loading",
  subMessage = "Please wait a moment",
}: PageLoaderProps) {
  if (!fullPage) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message}
        className="flex min-h-[45vh] w-full items-center justify-center p-6"
      >
        <div className="flex flex-col items-center gap-5 rounded-[22px] border border-[#EDE7E2] bg-white/80 p-8 shadow-[0_8px_32px_rgba(27,22,21,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-card/80">
          <BloodDrop />
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold tracking-tight text-[#1B1615] dark:text-foreground">
                {message}
              </span>
              <LoadingDots />
            </div>
            <span className="text-[12px] text-[#9E8E85] dark:text-muted-foreground">
              {subMessage}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="
        fixed inset-0 z-[999999]
        flex h-screen w-screen min-h-dvh
        flex-col items-center justify-center overflow-hidden
        bg-[#FDF9F6] dark:bg-background
        px-4 transition-colors duration-300
      "
    >
      {/* ── Ambient Background Glows ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[600px] sm:w-[600px]"
        style={{
          background: "radial-gradient(circle, rgba(226,72,77,0.09) 0%, rgba(226,72,77,0.02) 45%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[-60px] top-[-60px] h-[320px] w-[320px] rounded-full sm:h-[400px] sm:w-[400px]"
        style={{
          background: "radial-gradient(circle, rgba(226,72,77,0.05) 0%, transparent 65%)",
        }}
      />

      {/* ── Dot Grid Texture ── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-50 dark:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="page-loader-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="rgba(226,72,77,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#page-loader-dots)" />
      </svg>

      {/* ── Ambient Concentric Rings ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[500px] sm:w-[500px]"
        style={{ border: "1px solid rgba(226,72,77,0.06)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[680px] sm:w-[680px]"
        style={{ border: "1px solid rgba(226,72,77,0.03)" }}
      />

      {/* ── Center Loading Card ── */}
      <div
        className="
          relative z-10 flex flex-col items-center gap-5
          rounded-[24px] border border-[#EDE7E2] dark:border-white/10
          bg-white/85 dark:bg-card/85
          px-10 py-9
          shadow-[0_12px_40px_rgba(27,22,21,0.08),0_1px_2px_rgba(27,22,21,0.04)]
          dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          backdrop-blur-xl text-center
        "
      >
        <BloodDrop />

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[14.5px] font-bold tracking-tight text-[#1B1615] dark:text-[#F8F5F2]">
              {message}
            </span>
            <LoadingDots />
          </div>

          <span className="text-[12px] font-medium text-[#9E8E85] dark:text-[#A79D96]">
            {subMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
