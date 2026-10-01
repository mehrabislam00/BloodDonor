"use client";

import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { changePassword } from "@/lib/auth-client";

type PasswordFields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordErrors = Partial<Record<keyof PasswordFields, string>>;

const inputClass = "w-full rounded-[10px] border border-[#E0D9D4] bg-white px-4 py-3 text-[13.5px] text-[#1B1615] outline-none transition-all placeholder:text-[#C5B8B0] focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10";

function PasswordInput({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">{label}</label>
      <div className="relative">
        <LockKeyhole size={15} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0]" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} pl-10 pr-11 ${error ? "border-[#E2484D] ring-2 ring-[#E2484D]/10" : ""}`}
          autoComplete={label === "Current password" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0] transition-colors hover:text-[#68625E]"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="mt-1 text-[11px] font-medium text-[#E2484D]">{error}</p>}
    </div>
  );
}

export default function ChangePasswordCard() {
  const [form, setForm] = useState<PasswordFields>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (field: keyof PasswordFields) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setAuthError("");
    setSuccess(false);
  };

  const validate = () => {
    const nextErrors: PasswordErrors = {};
    if (!form.currentPassword) nextErrors.currentPassword = "Enter your current password.";
    if (!form.newPassword) nextErrors.newPassword = "Enter a new password.";
    else if (form.newPassword.length < 8) nextErrors.newPassword = "Use at least 8 characters.";
    if (form.newPassword !== form.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || saving) return;

    setSaving(true);
    setAuthError("");
    setSuccess(false);

    try {
      const { error } = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
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
    <section className="rounded-[20px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)] sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[#E2484D]">
          <KeyRound size={18} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-[16px] font-extrabold tracking-[-0.015em] text-[#1B1615]">Change password</h2>
          <p className="mt-1 text-[12.5px] text-[#9E8E85]">Keep your account secure with a strong password.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-3">
        <PasswordInput label="Current password" value={form.currentPassword} error={errors.currentPassword} onChange={update("currentPassword")} />
        <PasswordInput label="New password" value={form.newPassword} error={errors.newPassword} onChange={update("newPassword")} />
        <PasswordInput label="Confirm new password" value={form.confirmPassword} error={errors.confirmPassword} onChange={update("confirmPassword")} />

        <div className="flex flex-col gap-2 sm:col-span-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5 text-[12px]">
            {authError && <p role="alert" className="font-medium text-[#E2484D]">{authError}</p>}
            {success && (
              <p className="flex items-center gap-1.5 font-medium text-[#1A9E56]">
                <ShieldCheck size={14} /> Password updated successfully.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex h-[44px] items-center justify-center gap-2 rounded-[11px] bg-[#E2484D] px-5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(226,72,77,0.18)] transition-all hover:bg-[#D83E43] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}
