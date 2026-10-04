"use client";

import React, { useState } from "react";
import { Flag, X, Loader2, Check } from "lucide-react";
import { toast } from "@/lib/toast";
import { requireAuthentication } from "@/lib/require-authentication";

// ── Report reasons ────────────────────────────────────────────────────────

const REASONS = [
  "Invalid Phone Number",
  "Fake or Incorrect Information",
  "Donor Unavailable",
  "Inappropriate Behavior",
  "Misleading Information",
  "Other",
];

// ── Types ─────────────────────────────────────────────────────────────────

interface Props {
  donorId:   string;
  donorName: string;
  onClose:   () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export function ReportModal({ donorId, donorName, onClose }: Props) {
  const [selected,    setSelected]    = useState("");
  const [description, setDescription] = useState("");
  const [descError,   setDescError]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const isOther   = selected === "Other";
  const canSubmit = !!selected && (!isOther || description.trim().length > 0);

  const handleSelect = (reason: string) => {
    setSelected(reason);
    setDescError(false);
  };

  const handleSubmit = async () => {
    if (!selected || submitting) return;

    if (isOther && !description.trim()) {
      setDescError(true);
      return;
    }

    setSubmitting(true);
    try {
      if (!(await requireAuthentication("Please log in to report a donor."))) return;

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId,
          reason: selected,
          description: isOther ? description.trim() : "",
        }),
      });

      if (!response.ok) {
        const result = await response.json() as { error?: string };
        if (response.status === 401) {
          toast.warning("Please log in to report a donor.");
        } else {
          toast.error({
            title: "Submission failed",
            description: result.error || "Failed to submit report. Please try again.",
          });
        }
        return;
      }

      toast.success({
        title:       "Report submitted",
        description: "Thank you. Your report has been submitted for review.",
      });
      onClose();
    } catch {
      toast.error({
        title:       "Submission failed",
        description: "Failed to submit report. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[420px] rounded-[22px] border border-[#EDE7E2] bg-white shadow-[0_32px_80px_rgba(27,22,21,0.18)]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-[#F0EAE5] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0F0]">
              <Flag size={15} strokeWidth={2} className="text-[#E2484D]" />
            </div>
            <div>
              <h3 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1B1615]">
                Report Donor
              </h3>
              <p className="text-[12px] text-[#9E8E85]">{donorName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] transition-all hover:bg-[#FAF7F4] hover:text-[#1B1615]"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5">
          <p className="mb-3.5 text-[12.5px] font-medium text-[#9E8E85]">
            Select the reason for reporting this donor
          </p>

          {/* Reason list */}
          <div className="flex flex-col gap-1.5">
            {REASONS.map((reason) => {
              const active = selected === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleSelect(reason)}
                  className={[
                    "flex items-center gap-3 rounded-[11px] px-4 py-[11px] text-left",
                    "text-[13.5px] transition-all duration-150",
                    active
                      ? "bg-[#FFF0F0] font-semibold text-[#E2484D]"
                      : "text-[#403A37] hover:bg-[#FAF7F4]",
                  ].join(" ")}
                >
                  {/* Radio circle */}
                  <span
                    className={[
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center",
                      "rounded-full border-2 transition-all duration-150",
                      active
                        ? "border-[#E2484D] bg-[#E2484D]"
                        : "border-[#DDD6D1] bg-white",
                    ].join(" ")}
                  >
                    {active && <Check size={10} strokeWidth={3} className="text-white" />}
                  </span>

                  {reason}
                </button>
              );
            })}
          </div>

          {/* "Other" description — smooth reveal */}
          <div
            className={[
              "overflow-hidden transition-all duration-200",
              isOther ? "mt-3 max-h-[160px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim()) setDescError(false);
              }}
              placeholder="Please briefly explain the issue..."
              rows={3}
              className={[
                "w-full resize-none rounded-[11px] border px-4 py-3",
                "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0]",
                "outline-none transition-all duration-200",
                descError
                  ? "border-[#E2484D] ring-2 ring-[#E2484D]/10"
                  : "border-[#E0D9D4] hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10",
              ].join(" ")}
            />
            {descError && (
              <p className="mt-1 text-[11px] font-medium text-[#E2484D]">
                ⚠ Please describe the issue before submitting.
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-[#F0EAE5] px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-[40px] items-center rounded-[10px] border border-[#E0D9D4] bg-white px-5 text-[13px] font-semibold text-[#68625E] transition-all hover:bg-[#FAF7F4]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={[
              "flex h-[40px] items-center gap-2 rounded-[10px] px-5",
              "text-[13px] font-semibold text-white transition-all duration-200",
              canSubmit && !submitting
                ? "bg-[#E2484D] shadow-[0_4px_16px_rgba(226,72,77,0.20)] hover:bg-[#D83E43] hover:shadow-[0_6px_20px_rgba(226,72,77,0.28)] active:scale-[0.98]"
                : "cursor-not-allowed bg-[#E2484D]/40",
            ].join(" ")}
          >
            {submitting ? (
              <><Loader2 size={14} className="animate-spin" />Submitting…</>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}