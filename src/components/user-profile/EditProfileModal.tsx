"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X, Check, Loader2, User, Mail, Phone, Calendar,
  MessageCircle, MapPin, Droplets, Camera, ChevronDown,
} from "lucide-react";
import type { UserProfile } from "./types";
import { AVAILABILITY, BLOOD_GROUPS, AREAS, GENDERS } from "./types";
import { toast } from "@/components/toast/ui/toast";

// ── Mini field-level select ───────────────────────────────────────────────

function MiniSelect({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className={[
          "flex h-[44px] w-full items-center justify-between gap-2 rounded-[10px] border px-4",
          "text-[13.5px] outline-none transition-all duration-200 bg-white",
          open
            ? "border-[#E2484D]/60 ring-2 ring-[#E2484D]/10 shadow-sm"
            : "border-[#E0D9D4] hover:border-[#E2484D]/40",
          !value ? "text-[#C5B8B0]" : "text-[#1B1615]",
        ].join(" ")}
      >
        <span className="truncate">{value || placeholder || "Select"}</span>
        <ChevronDown size={15} strokeWidth={2}
          className={`shrink-0 transition-transform ${open ? "rotate-180 text-[#E2484D]" : "text-[#9E8E85]"}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+5px)] z-50 overflow-hidden rounded-[13px] border border-[#EDE7E2] bg-white shadow-[0_16px_48px_rgba(27,22,21,0.14)]">
          <div className="max-h-[200px] overflow-y-auto py-1.5
            [&::-webkit-scrollbar]:w-[4px]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#E7E0DB]
            [&::-webkit-scrollbar-track]:bg-transparent
          ">
            {options.map((opt) => (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={[
                  "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-[13px] text-left",
                  "transition-all duration-150",
                  value === opt
                    ? "bg-[#FFF0F0] font-semibold text-[#E2484D]"
                    : "text-[#1B1615] hover:bg-[#FAF7F4] hover:pl-6",
                ].join(" ")}
              >
                {opt}
                {value === opt && <Check size={13} strokeWidth={2.5} className="shrink-0 text-[#E2484D]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────

function Field({
  label, icon: Icon, children,
}: {
  label: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[#403A37]">
        <Icon size={12} strokeWidth={2.5} className="text-[#9E8E85]" />
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────

interface Props {
  user:    UserProfile;
  onClose: () => void;
  onSave:  (u: UserProfile) => void;
}

export default function EditProfileModal({ user, onClose, onSave }: Props) {
  const [form,    setForm]    = useState({ ...user });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const set = (k: keyof UserProfile) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, avatarUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update your profile.");
      }

      toast.success({ title: "Profile updated", description: "Your profile information has been saved successfully." });
      setSuccess(true);
      onSave({
        ...form,
        ...result.profile,
        fullName: result.user?.name || form.fullName,
        email: result.user?.email || form.email,
      });
      setTimeout(onClose, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update your profile.";
      setError(message);
      toast.error({ title: "Profile update failed", description: message });
    } finally {
      setSaving(false);
    }
  };

  const ic = [
    "w-full h-[44px] rounded-[10px] border border-[#E0D9D4] bg-white px-4",
    "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none",
    "transition-all duration-200",
    "hover:border-[#E2484D]/30",
    "focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10",
  ].join(" ");

  const ini = form.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col rounded-[22px] border border-[#EDE7E2] bg-white shadow-[0_32px_80px_rgba(27,22,21,0.18)]">

        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#F0EAE5] px-7 py-5">
          <div>
            <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1B1615]">Edit Profile</h3>
            <p className="mt-0.5 text-[12.5px] text-[#9E8E85]">Update your account information</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] transition-all hover:bg-[#FAF7F4] hover:text-[#1B1615]">
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6
          [&::-webkit-scrollbar]:w-[4px]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#E7E0DB]
          [&::-webkit-scrollbar-track]:bg-transparent
        ">
          <div className="flex flex-col gap-4">

            {/* Avatar upload */}
            <div
              className="flex cursor-pointer items-center gap-5 rounded-[14px] border-[1.5px] border-dashed border-[#DDD6D1] bg-[#FDFAF8] p-4 transition-all hover:border-[#E2484D]/40 hover:bg-[#FFF5F5]"
              onClick={() => inputRef.current?.click()}
            >
              <div className="relative shrink-0">
                {form.avatarUrl
                  ? <img src={form.avatarUrl} alt="avatar"
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-[#E2484D]/20" />
                  : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE4E4] text-[17px] font-extrabold text-[#E2484D]">
                      {ini}
                    </div>
                }
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E2484D] shadow">
                  <Camera size={12} strokeWidth={2} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1B1615]">
                  {form.avatarUrl ? "Change photo" : "Upload photo"}
                </p>
                <p className="mt-0.5 text-[11.5px] text-[#9E8E85]">JPG, PNG or WEBP · max 5 MB</p>
              </div>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>

            {/* Full name */}
            <Field label="Full Name" icon={User}>
              <input type="text" value={form.fullName} onChange={set("fullName")}
                className={ic} placeholder="Your full name" />
            </Field>

            {/* Email */}
            <Field label="Email" icon={Mail}>
              <input type="email" value={form.email} onChange={set("email")}
                className={ic} placeholder="you@example.com" readOnly />
            </Field>

            {/* Phone + WhatsApp */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" icon={Phone}>
                <input type="tel" value={form.phone} onChange={set("phone")}
                  className={ic} placeholder="01XXXXXXXXX" />
              </Field>
              <Field label="WhatsApp" icon={MessageCircle}>
                <input type="tel" value={form.whatsapp} onChange={set("whatsapp")}
                  className={ic} placeholder="01XXXXXXXXX" />
              </Field>
            </div>

            {/* Date of birth + gender */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth" icon={Calendar}>
                <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")}
                  className={ic} />
              </Field>
              <Field label="Gender" icon={User}>
                <MiniSelect value={form.gender}
                  onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                  options={GENDERS} placeholder="Select" />
              </Field>
            </div>

            {/* Blood Group + Area */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Blood Group" icon={Droplets}>
                <MiniSelect value={form.bloodGroup}
                  onChange={(v) => setForm((f) => ({ ...f, bloodGroup: v }))}
                  options={BLOOD_GROUPS} placeholder="Select" />
              </Field>
              <Field label="Area" icon={MapPin}>
                <MiniSelect value={form.area}
                  onChange={(v) => setForm((f) => ({ ...f, area: v }))}
                  options={AREAS} placeholder="Select" />
              </Field>
            </div>

            <Field label="Availability" icon={Droplets}>
              <MiniSelect value={form.availability}
                onChange={(v) => setForm((f) => ({ ...f, availability: v }))}
                options={AVAILABILITY} placeholder="Select" />
            </Field>

            <Field label="Address" icon={MapPin}>
              <textarea value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={`${ic} min-h-[88px] resize-y py-3`} placeholder="Your address" />
            </Field>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#F0EAE5] px-7 py-5">
          {error && <p role="alert" className="mr-auto text-[12px] font-medium text-[#E2484D]">{error}</p>}
          <button onClick={onClose}
            className="flex h-[44px] items-center rounded-[10px] border border-[#E0D9D4] bg-white px-6 text-[13.5px] font-semibold text-[#68625E] transition-all hover:bg-[#FAF7F4]">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex h-[44px] items-center gap-2 rounded-[10px] bg-[#E2484D] px-6 text-[13.5px] font-semibold text-white shadow-[0_6px_20px_rgba(226,72,77,0.22)] transition-all hover:bg-[#D83E43] disabled:opacity-70">
            {saving
              ? <><Loader2 size={14} className="animate-spin" />Saving…</>
              : success
                ? <><Check size={14} strokeWidth={2.5} />Saved!</>
                : <><Check size={14} strokeWidth={2.5} />Save Changes</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}