// src/app/Components/Home/Hero/BloodDonorCards.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ── Donor data ─────────────────────────────────────────────────────────────
// avatar: uses DiceBear's "notionists" style — reliable, neutral, human-ish
const donors = [
  {
    name: "Nusrat Jahan",
    blood: "A+",
    area: "Dhanmondi",
    status: "available" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Nusrat&backgroundColor=fce4e4",
  },
  {
    name: "Rahim Hasan",
    blood: "O+",
    area: "Mirpur",
    status: "nearby" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Rahim&backgroundColor=e4eafc",
  },
  {
    name: "Tahmina Islam",
    blood: "B+",
    area: "Gulshan",
    status: "available" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Tahmina&backgroundColor=e4fcf0",
  },
  {
    name: "Sabbir Khan",
    blood: "AB+",
    area: "Uttara",
    status: "nearby" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Sabbir&backgroundColor=fceee4",
  },
  {
    name: "Fatema Akter",
    blood: "O−",
    area: "Mohammadpur",
    status: "available" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Fatema&backgroundColor=fce4f0",
  },
  {
    name: "Mizanur Rahman",
    blood: "B−",
    area: "Tejgaon",
    status: "nearby" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Mizanur&backgroundColor=f0e4fc",
  },
  {
    name: "Sumaiya Reza",
    blood: "A−",
    area: "Banani",
    status: "available" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Sumaiya&backgroundColor=e4f4fc",
  },
  {
    name: "Kamal Ahmed",
    blood: "AB−",
    area: "Rampura",
    status: "nearby" as const,
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=Kamal&backgroundColor=fcf4e4",
  },
];

const firstRow  = donors.slice(0, Math.ceil(donors.length / 2));
const secondRow = donors.slice(Math.ceil(donors.length / 2));

// ── Self-contained Marquee ─────────────────────────────────────────────────
interface MarqueeProps {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
}

const Marquee = ({ children, reverse = false, duration = 28 }: MarqueeProps) => (
  <>
    <style>{`
      @keyframes mq-ltr { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
      @keyframes mq-rtl { from { transform: translateX(-50%); } to { transform: translateX(0); }    }
      .mq-track { display: flex; width: max-content; }
      .mq-ltr   { animation: mq-ltr var(--mq-dur) linear infinite; }
      .mq-rtl   { animation: mq-rtl var(--mq-dur) linear infinite; }
      .mq-wrap:hover .mq-track { animation-play-state: paused; }
    `}</style>

    <div
      className="mq-wrap overflow-hidden"
      style={{ "--mq-dur": `${duration}s` } as React.CSSProperties}
    >
      <div className={cn("mq-track", reverse ? "mq-rtl" : "mq-ltr")}>
        <div className="flex gap-4 pr-4">{children}</div>
        <div className="flex gap-4 pr-4" aria-hidden>{children}</div>
      </div>
    </div>
  </>
);

// ── Donor Card ─────────────────────────────────────────────────────────────
type Status = "available" | "nearby";

interface DonorCardProps {
  name: string;
  blood: string;
  area: string;
  status: Status;
  avatar: string;
}

const DonorCard = ({ name, blood, area, status, avatar }: DonorCardProps) => (
  <figure
    className={cn(
      // sizing
      "relative w-[248px] shrink-0 cursor-pointer",
      // glass base
      "rounded-[20px] p-4",
      "bg-white/70 backdrop-blur-md",
      // border — single subtle stroke
      "border border-white/80",
      // shadow
      "shadow-[0_4px_24px_rgba(27,22,21,0.07),0_1px_4px_rgba(226,72,77,0.06)]",
      // hover
      "transition-all duration-250 ease-out",
      "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(27,22,21,0.10),0_2px_8px_rgba(226,72,77,0.08)]",
      "hover:bg-white/80",
    )}
  >
    {/* ── Top row: avatar + name block + blood badge ── */}
    <div className="flex items-center gap-3">

      {/* Avatar */}
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
        <img
          src={avatar}
          alt={name}
          width={44}
          height={44}
          className="h-full w-full object-cover"
          onError={(e) => {
            // graceful fallback: show initials
            const t = e.currentTarget as HTMLImageElement;
            t.style.display = "none";
            const fb = t.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
        {/* Initials fallback (hidden by default) */}
        <div
          className="hidden h-full w-full items-center justify-center rounded-full bg-[#FFE8E8] text-[11px] font-bold text-[#E2484D]"
          aria-hidden
        >
          {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
      </div>

      {/* Name + location */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-bold leading-tight text-[#1B1615]">
          {name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-[#9E8E85]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#B5A49C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {area}
        </p>
      </div>

      {/* Blood group badge */}
      <span className="shrink-0 rounded-full border border-[#E2484D]/25 bg-[#FFF0F0] px-2.5 py-0.5 text-[11px] font-extrabold text-[#E2484D]">
        {blood}
      </span>
    </div>

    {/* ── Divider ── */}
    <div className="my-3.5 h-px bg-[#F0ECEA]" />

    {/* ── Bottom row: status + contact ── */}
    <div className="flex items-center justify-between gap-2">
      {status === "available" ? (
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11.5px] font-semibold text-emerald-600">Available now</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-[11.5px] font-semibold text-amber-600">Nearby in Dhaka</span>
        </div>
      )}

      <button
        className={cn(
          "h-7 rounded-lg px-3 text-[11px] font-bold",
          "border border-[#E2484D]/20 bg-[#FFF0F0] text-[#E2484D]",
          "transition-all duration-150",
          "hover:bg-[#E2484D] hover:text-white hover:border-[#E2484D]",
          "active:scale-[0.97]",
        )}
      >
        Contact
      </button>
    </div>
  </figure>
);

// ── BloodDonorCards ────────────────────────────────────────────────────────
export const BloodDonorCards = () => (
  <div className="relative flex w-full flex-col justify-center gap-4 overflow-hidden py-10 lg:h-[520px] lg:py-0">

    {/* Ambient glow behind the cards — very subtle */}
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E2484D]/5 blur-3xl" />

    {/* Edge fade masks — match page background */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FDF9F6] to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FDF9F6] to-transparent" />
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-[#FDF9F6] to-transparent" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#FDF9F6] to-transparent" />

    {/* Row 1 — left → right */}
    <Marquee duration={32}>
      {firstRow.map((d) => (
        <DonorCard key={d.name} {...d} />
      ))}
    </Marquee>

    {/* Row 2 — right → left */}
    <Marquee reverse duration={28}>
      {secondRow.map((d) => (
        <DonorCard key={d.name} {...d} />
      ))}
    </Marquee>
  </div>
);