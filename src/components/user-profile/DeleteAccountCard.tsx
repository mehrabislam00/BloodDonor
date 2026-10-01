"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2, AlertTriangle, X, Loader2,
  LockKeyhole, Eye, EyeOff,
} from "lucide-react";
import { toast } from "@/components/toast/ui/toast";
import { useProfileData } from "@/components/profile/ProfileDataProvider";


// ── Confirmation modal ────────────────────────────────────────────────────

function ConfirmModal({ onClose }: { onClose: () => void }) {
  const router             = useRouter();
  const { clearAccountState } = useProfileData();
  const [password, setPassword] = useState("");
  const [visible,  setVisible]  = useState(false);
  const [error,    setError]    = useState("");
  const [deleting, setDeleting] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [statusAttempt, setStatusAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/password-status", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to verify account security.");
        const result = await response.json();
        if (typeof result.hasPassword !== "boolean") {
          throw new Error("Unable to verify account security.");
        }
        if (active) {
          setHasPassword(result.hasPassword);
          setStatusError("");
        }
      })
      .catch(() => {
        if (active) setStatusError("We couldn't verify your account security. Try again before deleting.");
      })
      .finally(() => {
        if (active) setCheckingPassword(false);
      });

    return () => { active = false; };
  }, [statusAttempt]);

  const handleDelete = async () => {
    if (checkingPassword || hasPassword === null || deleting) return;
    if (hasPassword && !password.trim()) {
      setError("Enter your current password to confirm deletion.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hasPassword ? { password } : {}),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const code = typeof result.code === "string" ? result.code : "";
        const message = String(result.message || result.error?.message || "").toLowerCase();

        if (code === "SESSION_EXPIRED" || message.includes("expired") || message.includes("fresh") || message.includes("session")) {
          const sessionError = "Your session is no longer fresh. Please sign out and sign back in, then try deleting the account again.";
          setError(sessionError);
          toast.error({ title: "Delete failed", description: sessionError });
          return;
        }

        if (code === "PASSWORD_REQUIRED" || code === "INVALID_PASSWORD" || message.includes("password")) {
          const passwordError = code === "PASSWORD_REQUIRED"
            ? "Enter your current password to confirm deletion."
            : "Incorrect password. Please enter your current password.";
          setError(passwordError);
          toast.error({ title: "Delete failed", description: passwordError });
          return;
        }

        const genericError = "We couldn't delete your account right now. Please try again.";
        setError(genericError);
        toast.error({ title: "Delete failed", description: genericError });
        return;
      }

      await clearAccountState();
      toast.delete({
        title: "Account Deleted Successfully",
        description: "Your account has been permanently deleted.",
        duration: 5500,
      });
      router.replace("/signin");
      router.refresh();
    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);
      toast.error({ title: "Delete failed", description: message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1B1615]/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[440px] rounded-[22px] border border-[#EDE7E2] bg-white shadow-[0_32px_80px_rgba(27,22,21,0.18)]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-[#F0EAE5] px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={18} strokeWidth={2} className="text-[#E2484D]" />
            </div>
            <div>
              <h3 className="text-[16px] font-extrabold tracking-[-0.015em] text-[#1B1615]">
                Delete Account
              </h3>
              <p className="mt-0.5 text-[12px] text-[#9E8E85]">This action cannot be undone</p>
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
        <div className="px-7 py-6">

          {/* Warning box */}
          <div className="mb-5 rounded-[13px] border border-[#FECACA] bg-[#FFF5F5] px-4 py-4">
            <p className="text-[12.5px] leading-relaxed text-[#991B1B]">
              Deleting your account will permanently remove:
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {[
                "Your profile and personal information",
                "Your donor registration (if any)",
                "All your account activity and history",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-[#991B1B]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2484D]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Account verification */}
          {checkingPassword && (
            <p className="text-[12.5px] text-[#9E8E85]">Checking your account security...</p>
          )}
          {!checkingPassword && statusError && (
            <div className="flex items-center justify-between gap-3 rounded-[11px] bg-[#FFF5F5] px-3.5 py-3">
              <p role="alert" className="text-[12px] text-[#991B1B]">{statusError}</p>
              <button
                type="button"
                onClick={() => { setCheckingPassword(true); setStatusAttempt((attempt) => attempt + 1); }}
                className="shrink-0 text-[12px] font-semibold text-[#E2484D]"
              >
                Retry
              </button>
            </div>
          )}
          {!checkingPassword && !statusError && hasPassword && (
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
                Enter your password to confirm
              </label>
            <div className="relative">
              <LockKeyhole
                size={15} strokeWidth={2}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0]"
              />
              <input
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Your current password"
                required
                autoComplete="current-password"
                className={[
                  "w-full rounded-[11px] border bg-[#FDFAF8] pl-10 pr-11 py-3",
                  "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0]",
                  "outline-none transition-all duration-200",
                  error
                    ? "border-[#E2484D] ring-2 ring-[#E2484D]/10 bg-white"
                    : "border-[#E0D9D4] hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0] transition-colors hover:text-[#68625E]"
              >
                {visible ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-[11.5px] font-medium text-[#E2484D]">⚠ {error}</p>
            )}
          </div>
          )}
          {!checkingPassword && !statusError && hasPassword === false && (
            <p className="rounded-[11px] bg-[#FAF7F4] px-3.5 py-3 text-[12px] leading-relaxed text-[#68625E]">
              No password is linked to this account. You can confirm deletion without entering one.
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-[#F0EAE5] px-7 py-5">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex h-[44px] items-center rounded-[10px] border border-[#E0D9D4] bg-white px-6 text-[13.5px] font-semibold text-[#68625E] transition-all hover:bg-[#FAF7F4] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || checkingPassword || hasPassword === null || (hasPassword && !password.trim())}
            className="
              flex h-[44px] items-center gap-2 rounded-[10px]
              bg-[#E2484D] px-6 text-[13.5px] font-semibold text-white
              shadow-[0_6px_20px_rgba(226,72,77,0.22)]
              transition-all duration-200
              hover:bg-[#C73E43] hover:shadow-md
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {deleting
              ? <><Loader2 size={14} className="animate-spin" />Deleting…</>
              : <><Trash2 size={14} strokeWidth={2} />Yes, delete my account</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────

export default function DeleteAccountCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="rounded-[20px] border border-[#FECACA] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(226,72,77,0.08)] sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Left — icon + text */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0]">
              <Trash2 size={18} strokeWidth={2} className="text-[#E2484D]" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold tracking-[-0.015em] text-[#1B1615]">
                Delete Account
              </h2>
              <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-[#9E8E85]">
                Permanently remove your account and all associated data. This action
                is irreversible and cannot be undone.
              </p>
            </div>
          </div>

          {/* Right — button */}
          <button
            onClick={() => setShowModal(true)}
            className="
              flex shrink-0 items-center gap-2 self-start
              rounded-[12px] border border-[#FECACA] bg-[#FFF5F5]
              px-5 py-2.5 text-[13.5px] font-semibold text-[#E2484D]
              transition-all duration-200
              hover:border-[#E2484D] hover:bg-[#E2484D] hover:text-white
              hover:shadow-[0_6px_20px_rgba(226,72,77,0.22)]
              sm:self-auto
            "
          >
            <Trash2 size={14} strokeWidth={2} />
            Delete Account
          </button>
        </div>
      </section>

      {showModal && <ConfirmModal onClose={() => { setShowModal(false); toast.cancel({ title: "Delete cancelled", description: "Your account was not deleted." }); }} />}
    </>
  );
}