"use client";

import React from "react";
import { CheckCircle, Circle, Pencil } from "lucide-react";
import type { UserProfile } from "./types";
import { COMPLETION_ITEMS, calcCompletion } from "./types";

interface Props {
  user:   UserProfile;
  onEdit: () => void;
}

export default function ProfileCompletionCard({ user, onEdit }: Props) {
  const pct      = calcCompletion(user);
  const complete = pct === 100;

  return (
    <div className="rounded-[20px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(27,22,21,0.08)]">

      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-extrabold tracking-[-0.015em] text-[#1B1615]">
            Complete Your Profile
          </h3>
          <p className="mt-1 text-[12.5px] text-[#9E8E85]">
            {complete
              ? "Everything looks great — your profile is fully set up."
              : "Add a few more details so people can find and trust you."}
          </p>
        </div>
        <span className={[
          "shrink-0 rounded-full px-3 py-1 text-[12px] font-bold",
          complete
            ? "bg-[#EDFAF3] text-[#1A9E56]"
            : "bg-[#FFF0F0] text-[#E2484D]",
        ].join(" ")}>
          {pct}%
        </span>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-2">
        {COMPLETION_ITEMS.map(({ key, label }) => {
          const val  = user[key];
          const done = Boolean(val && String(val).trim() !== "");
          return (
            <div
              key={key}
              className={[
                "flex items-center gap-3 rounded-[12px] px-4 py-3 transition-all duration-150",
                done
                  ? "bg-[#FAFAF9]"
                  : "bg-[#FFF8F8] hover:bg-[#FFF0F0] cursor-pointer",
              ].join(" ")}
              onClick={done ? undefined : onEdit}
            >
              {done
                ? <CheckCircle size={16} strokeWidth={2} className="shrink-0 text-[#1A9E56]" />
                : <Circle     size={16} strokeWidth={2} className="shrink-0 text-[#DDD6D1]" />
              }
              <span className={[
                "flex-1 text-[13px] font-semibold",
                done ? "text-[#68625E]" : "text-[#1B1615]",
              ].join(" ")}>
                {label}
              </span>
              {!done && (
                <span className="text-[11px] font-medium text-[#E2484D]">Add →</span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA if incomplete */}
      {!complete && (
        <button
          onClick={onEdit}
          className="
            mt-5 flex h-[44px] w-full items-center justify-center gap-2
            rounded-[12px] border border-[#E0D9D4] bg-white
            text-[13.5px] font-semibold text-[#1B1615]
            transition-all duration-200
            hover:border-[#E2484D]/40 hover:bg-[#FFF5F5] hover:text-[#E2484D]
          "
        >
          <Pencil size={13} strokeWidth={2.2} />
          Complete Profile
        </button>
      )}
    </div>
  );
}