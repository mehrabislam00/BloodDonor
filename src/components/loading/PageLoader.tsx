// components/loading/PageLoader.tsx

import React from "react";

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
          border-[2px] border-[#E2484D]/15
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
      <span className="absolute h-14 w-14 animate-ping rounded-full bg-[#E2484D]/8 motion-reduce:animate-none" />
      <span className="absolute h-10 w-10 animate-ping rounded-full bg-[#E2484D]/12 [animation-delay:150ms] motion-reduce:animate-none" />

      {/* Drop */}
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE4E4]">
        <svg
          viewBox="0 0 40 48"
          className="h-6 w-5 fill-[#E2484D] animate-subtle-bob motion-reduce:animate-none"
          aria-hidden="true"
        >
          <path d="M20 2 C20 2 4 19 4 30 C4 39.5 11.2 46 20 46 C28.8 46 36 39.5 36 30 C36 19 20 2 20 2Z" />
          <path
            d="M13 28 C13 23 17 17 19 14 C15 20 12 24 12 29 C12 31 13 33 15 34 C13.7 32.5 13 30.5 13 28Z"
            fill="white"
            opacity="0.4"
          />
        </svg>
      </span>
    </div>
  );
}

// ── Loading dots — subtle animated ellipsis ───────────────────────────────────
function LoadingDots() {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden="true">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="
            h-[3px] w-[3px] rounded-full bg-[#9E8E85]
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
  message?:  string;
}

export default function PageLoader({
  fullPage = false,
  message  = "Loading",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`
        flex items-center justify-center
        ${fullPage ? "min-h-[70vh]" : "min-h-[45vh]"}
      `}
    >
      <div className="
        flex flex-col items-center gap-5
        rounded-[20px] border border-[#EDE7E2] bg-white
        px-10 py-8
        shadow-[0_8px_32px_rgba(27,22,21,0.07)]
      ">
        <BloodDrop />

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-[#1B1615]">
              {message}
            </span>
            <LoadingDots />
          </div>
          <span className="text-[11.5px] text-[#B5A89F]">
            Please wait a moment
          </span>
        </div>
      </div>
    </div>
  );
}