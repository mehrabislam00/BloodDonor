"use client";

import React, { useState } from "react";
import {
  Eye, EyeOff, KeyRound, Loader2,
  LockKeyhole, ShieldCheck, CheckCircle,
} from "lucide-react";
import { changePassword } from "@/lib/auth-client";

// ── Types ─────────────────────────────────────────────────────────────────

type PasswordFields = {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
};
type PasswordErrors = Partial<Record<keyof PasswordFields, string>>;

// ── Password strength ─────────────────────────────────────────────────────

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "",         color: "" };
  let score = 0;
  if (pw.length >= 8)                    score++;
  if (pw.length >= 12)                   score++;
  if (/[A-Z]/.test(pw))                  score++;
  if (/[0-9]/.test(pw))                  score++;
  if (/[^A-Za-z0-9]/.test(pw))           score++;

  if (score <= 1) return { score, label: "Weak",   color: "#E2484D" };
  if (score <= 3) return { score, label: "Fair",   color: "#F59E0B" };
  if (score === 4) return { score, label: "Good",  color: "#3B82F6" };
  return              { score, label: "Strong",    color: "#1A9E56" };
}

// ── Password input ────────────────────────────────────────────────────────

function PasswordInput({
  label, value, error, hint, onChange,
}: {
  label:    string;
  value:    string;
  error?:   string;
  hint?:    React.ReactNode;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-[#403A37]">{label}</label>
      <div className="relative">
        <LockKeyhole
          size={15} strokeWidth={2}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0]"
        />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={label === "Current password" ? "current-password" : "new-password"}
          placeholder={label === "Current password" ? "Enter current password" : "••••••••"}
          className={[
            "w-full rounded-[11px] border bg-[#FDFAF8] pl-10 pr-11 py-3",
            "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0]",
            "outline-none transition-all duration-200",
            hasError
              ? "border-[#E2484D] ring-2 ring-[#E2484D]/10 bg-white"
              : "border-[#E0D9D4] hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10 focus:bg-white focus:shadow-sm",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0] transition-colors hover:text-[#68625E]"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {hint}
      {error && (
        <p className="text-[11px] font-medium text-[#E2484D]">⚠ {error}</p>
      )}
    </div>
  );
}

// ── Strength bar ──────────────────────────────────────────────────────────

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);
  const pct = Math.round((score / 5) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0EAE5]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="shrink-0 text-[11px] font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// ── Requirements checklist ────────────────────────────────────────────────

function Requirements({ password }: { password: string }) {
  if (!password) return null;

  const items = [
    { label: "At least 8 characters",      met: password.length >= 8          },
    { label: "One uppercase letter",        met: /[A-Z]/.test(password)        },
    { label: "One number",                  met: /[0-9]/.test(password)        },
    { label: "One special character",       met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
      {items.map(({ label, met }) => (
        <p key={label} className={[
          "flex items-center gap-1.5 text-[11px] font-medium",
          met ? "text-[#1A9E56]" : "text-[#B5A89F]",
        ].join(" ")}>
          <span className={[
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-white",
            met ? "bg-[#1A9E56]" : "bg-[#DDD6D1]",
          ].join(" ")} style={{ fontSize: 8 }}>
            ✓
          </span>
          {label}
        </p>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function ChangePasswordCard() {
  const [form, setForm] = useState<PasswordFields>({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [errors,    setErrors]    = useState<PasswordErrors>({});
  const [authError, setAuthError] = useState("");
  const [success,   setSuccess]   = useState(false);
  const [saving,    setSaving]    = useState(false);

  const update = (field: keyof PasswordFields) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setAuthError("");
    setSuccess(false);
  };

  const validate = () => {
    const e: PasswordErrors = {};
    if (!form.currentPassword)                          e.currentPassword = "Enter your current password.";
    if (!form.newPassword)                              e.newPassword     = "Enter a new password.";
    else if (form.newPassword.length < 8)               e.newPassword     = "Use at least 8 characters.";
    if (form.newPassword !== form.confirmPassword)      e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || saving) return;

    setSaving(true);
    setAuthError("");
    setSuccess(false);

    try {
      const { error } = await changePassword({
        currentPassword:    form.currentPassword,
        newPassword:        form.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setAuthError(error.message || "Unable to change your password.");
        return;
      }

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess(true);
    } catch {
      setAuthError("Unable to change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-[20px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(27,22,21,0.08)] sm:p-8">

      {/* ── Header ── */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[#E2484D]">
          <KeyRound size={19} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-[16px] font-extrabold tracking-[-0.015em] text-[#1B1615]">
            Change Password
          </h2>
          <p className="mt-0.5 text-[12.5px] text-[#9E8E85]">
            Keep your account secure with a strong, unique password.
          </p>
        </div>
      </div>

      {/* ── Success banner ── */}
      {success && (
        <div className="mt-5 flex items-center gap-3 rounded-[13px] bg-[#EDFAF3] px-4 py-3.5 text-[13px] font-semibold text-[#1A9E56]">
          <CheckCircle size={16} strokeWidth={2} className="shrink-0" />
          Password updated successfully. All other sessions have been signed out.
        </div>
      )}

      {/* ── Auth error banner ── */}
      {authError && (
        <div className="mt-5 flex items-center gap-3 rounded-[13px] bg-[#FFF0F0] px-4 py-3.5 text-[13px] font-semibold text-[#E2484D]">
          <ShieldCheck size={16} strokeWidth={2} className="shrink-0" />
          {authError}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">

        {/* Current password */}
        <PasswordInput
          label="Current password"
          value={form.currentPassword}
          error={errors.currentPassword}
          onChange={update("currentPassword")}
        />

        {/* Divider */}
        <div className="border-t border-[#F0EAE5]" />

        {/* New password + strength */}
        <PasswordInput
          label="New password"
          value={form.newPassword}
          error={errors.newPassword}
          onChange={update("newPassword")}
          hint={
            form.newPassword
              ? <div className="mt-2 flex flex-col gap-2">
                  <StrengthBar password={form.newPassword} />
                  <Requirements password={form.newPassword} />
                </div>
              : null
          }
        />

        {/* Confirm password */}
        <PasswordInput
          label="Confirm new password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={update("confirmPassword")}
          hint={
            form.confirmPassword && form.newPassword === form.confirmPassword && !errors.confirmPassword
              ? <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#1A9E56]">
                  <CheckCircle size={12} strokeWidth={2.5} />
                  Passwords match
                </p>
              : null
          }
        />

        {/* Submit */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="
              flex h-[46px] items-center gap-2.5 rounded-[12px]
              bg-[#E2484D] px-7 text-[13.5px] font-semibold text-white
              shadow-[0_8px_24px_rgba(226,72,77,0.18)]
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-[#D83E43]
              hover:shadow-[0_14px_32px_rgba(226,72,77,0.28)]
              active:translate-y-0 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-70
            "
          >
            {saving
              ? <><Loader2 size={15} className="animate-spin" />Updating…</>
              : <><KeyRound size={15} strokeWidth={2} />Update Password</>
            }
          </button>
        </div>
      </form>
    </section>
  );
}