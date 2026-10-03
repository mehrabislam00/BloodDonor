import Link from "next/link";
import type { MouseEventHandler } from "react";

type BrandLogoProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  size?: "small" | "default";
  variant?: "standard" | "inverse";
};

export function BloodDropMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 2 C20 2 4 19 4 30 C4 39.5 11.2 46 20 46 C28.8 46 36 39.5 36 30 C36 19 20 2 20 2Z" />
      <path
        d="M13 28 C13 23 17 17 19 14 C15 20 12 24 12 29 C12 31 13 33 15 34 C13.7 32.5 13 30.5 13 28Z"
        fill="white"
        opacity="0.35"
      />
    </svg>
  );
}

export default function BrandLogo({
  className = "",
  onClick,
  size = "default",
  variant = "standard",
}: BrandLogoProps) {
  const isSmall = size === "small";
  const isInverse = variant === "inverse";

  return (
    <Link
      href="/"
      aria-label="BloodDonor Home"
      onClick={onClick}
      className={`group flex items-center gap-2.5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-px ${className}`}
    >
      <span
        className={`relative flex shrink-0 items-center justify-center ${
          isSmall ? "h-9 w-[30px]" : "h-11 w-10"
        }`}
      >
        <span
          className="
            absolute h-8 w-8 rounded-full bg-[#E2484D]/0 blur-xl
            transition-all duration-500 group-hover:bg-[#E2484D]/30
          "
        />
        <BloodDropMark
          className={`relative fill-[#E2484D] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 ${
            isSmall ? "h-9 w-[30px]" : "h-11 w-10"
          }`}
        />
      </span>

      <span
        className={`font-bold tracking-[-0.04em] transition-all duration-300 ${
          isSmall ? "text-lg" : "text-xl"
        }`}
      >
        <span
          className={`font-medium transition-colors duration-300 ${
            isInverse
              ? "text-white group-hover:text-white/85"
              : "text-[#1B1615] group-hover:text-[#2B2523]"
          }`}
        >
          Blood
        </span>
        <span className="font-medium text-[#E2484D] transition-colors duration-300 group-hover:text-[#C9363C]">
          Donor
        </span>
      </span>
    </Link>
  );
}
