"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, Pencil, ShieldCheck } from "lucide-react";
import type { UserProfile } from "./types";
import { calcCompletion } from "./types";

interface Props {
  user:     UserProfile;
  onEdit:   () => void;
  onAvatar: (url: string) => void;
  isAvatarSaving: boolean;
}

export default function ProfileHeader({ user, onEdit, onAvatar, isAvatarSaving }: Props) {
  const inputRef           = useRef<HTMLInputElement>(null);
  const [hover, setHover]  = useState(false);
  const pct                = calcCompletion(user);

  const ini = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-[20px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)] sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">

        {/* ── Avatar ── */}
        <div
          className={`relative shrink-0 self-start sm:self-auto ${isAvatarSaving ? "cursor-wait" : "cursor-pointer"}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => !isAvatarSaving && inputRef.current?.click()}
        >
          {/* Circle */}
          <div className={[
            "flex h-24 w-24 items-center justify-center rounded-full",
            "text-[28px] font-extrabold",
            "ring-4 transition-all duration-300",
            hover
              ? "ring-[#E2484D]/30 shadow-[0_0_0_6px_rgba(226,72,77,0.08)]"
              : "ring-[#FFE4E4]",
          ].join(" ")}
            style={{ background: user.avatarUrl ? "transparent" : "#FFE4E4" }}
          >
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt="avatar"
                  className="h-24 w-24 rounded-full object-cover" />
              : <span className="text-[#E2484D]">{ini}</span>
            }
          </div>

          {/* Camera overlay */}
          <div className={[
            "absolute inset-0 flex items-center justify-center rounded-full",
            "bg-[#1B1615]/30 transition-opacity duration-200",
            hover || isAvatarSaving ? "opacity-100" : "opacity-0",
          ].join(" ")}>
            {isAvatarSaving
              ? <Loader2 size={20} strokeWidth={2} className="animate-spin text-white" />
              : <Camera size={20} strokeWidth={2} className="text-white" />}
          </div>

          {/* Hidden file input */}
          <input ref={inputRef} type="file" accept="image/*"
            className="hidden" onChange={handleFile} disabled={isAvatarSaving} />
        </div>

        {/* ── Name / email / progress ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">

          {/* Name + verified */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[26px] font-extrabold tracking-[-0.025em] text-[#1B1615]">
                {user.fullName || "Your Name"}
              </h2>
              {pct === 100 && (
                <span className="flex items-center gap-1 rounded-full bg-[#EDFAF3] px-2.5 py-1 text-[11px] font-semibold text-[#1A9E56]">
                  <ShieldCheck size={11} strokeWidth={2.5} />
                  Complete
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[14px] text-[#9E8E85]">{user.email}</p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-[#403A37]">Profile completion</span>
              <span className="text-[12.5px] font-bold text-[#E2484D]">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5EFE9]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E2484D] to-[#FF6B6E] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11.5px] text-[#9E8E85]">
              {pct === 100
                ? "✓ Your profile is complete"
                : `${7 - Math.round((pct / 100) * 7)} field${(7 - Math.round((pct / 100) * 7)) === 1 ? "" : "s"} remaining`}
            </p>
          </div>
        </div>

        {/* ── Edit button ── */}
        <button
          onClick={onEdit}
          className="
            flex shrink-0 items-center gap-2 self-start
            rounded-[12px] border border-[#E0D9D4] bg-white
            px-5 py-2.5 text-[13.5px] font-semibold text-[#1B1615]
            shadow-sm transition-all duration-200
            hover:border-[#E2484D]/40 hover:bg-[#FFF5F5] hover:text-[#E2484D]
            hover:shadow-md sm:self-auto
          "
        >
          <Pencil size={14} strokeWidth={2.2} />
          Edit Profile
        </button>
      </div>
    </div>
  );
}