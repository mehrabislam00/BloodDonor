"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, Droplets, MapPin,
  Calendar, Clock, CheckCircle, ArrowRight,
  Loader2, ShieldCheck, Users, Check, ChevronDown,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AREAS = [
  "Dhanmondi", "Mirpur", "Uttara", "Gulshan",
  "Mohammadpur", "Banani", "Motijheel", "Farmgate",
];

// ✅ Added "Available in 2 Months"
const AVAILABILITY = [
  "Available Now",
  "Available in 1 Month",
  "Available in 2 Months",
  "Available in 3 Months",
  "Unavailable",
];

// ✅ Added dot color for 2 months
const AVAILABILITY_DOT: Record<string, string> = {
  "Available Now":         "bg-[#1A9E56]",
  "Available in 1 Month":  "bg-[#F59E0B]",
  "Available in 2 Months": "bg-[#F59E0B]",
  "Available in 3 Months": "bg-[#F97316]",
  "Unavailable":           "bg-[#9E8E85]",
};

// ── Types ─────────────────────────────────────────────────────────────────

type FormData = {
  fullName: string; email: string; phone: string;
  bloodGroup: string; area: string;
  lastDonationDate: string; availability: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

// ── CustomSelect ──────────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  hasError?: boolean;
  renderOption?: (o: string) => React.ReactNode;
  renderValue?:  (v: string) => React.ReactNode;
}

function CustomSelect({
  value, onChange, options,
  placeholder = "Select an option",
  hasError, renderOption, renderValue,
}: SelectProps) {
  const [isOpen,  setIsOpen]  = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };
  const close = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 180);
  };
  const toggle = () => (isOpen ? close() : open());

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  });

  return (
    <div ref={ref} className="relative">

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={toggle}
        className={[
          "group w-full h-[46px] rounded-[11px] border bg-white px-4",
          "flex items-center justify-between gap-2 cursor-pointer",
          "text-[13.5px] outline-none transition-all duration-200",
          hasError
            ? "border-[#E2484D] ring-2 ring-[#E2484D]/10"
            : isOpen
              ? "border-[#E2484D]/70 ring-2 ring-[#E2484D]/10 shadow-sm"
              : "border-[#E0D9D4] hover:border-[#E2484D]/40 hover:shadow-sm",
          !value ? "text-[#C5B8B0]" : "text-[#1B1615]",
        ].join(" ")}
      >
        <span className="truncate">
          {value
            ? (renderValue ? renderValue(value) : value)
            : placeholder}
        </span>
        <ChevronDown
          size={16} strokeWidth={2}
          className={[
            "shrink-0 transition-all duration-300",
            isOpen
              ? "rotate-180 text-[#E2484D]"
              : "text-[#9E8E85] group-hover:text-[#68625E]",
          ].join(" ")}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className={[
            "absolute top-[calc(100%+6px)] left-0 right-0 z-50",
            "rounded-[14px] border border-[#EDE7E2] bg-white",
            "shadow-[0_16px_48px_rgba(27,22,21,0.14)] overflow-hidden",
            "transition-all duration-[180ms] origin-top",
            visible
              ? "opacity-100 scale-y-100 translate-y-0"
              : "opacity-0 scale-y-95 -translate-y-1",
          ].join(" ")}
        >
          <div className="max-h-[230px] overflow-y-auto py-1.5
            [&::-webkit-scrollbar]:w-[4px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#E7E0DB]
          ">
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => { onChange(option); close(); }}
                  className={[
                    "w-full flex items-center justify-between gap-3",
                    "px-4 py-[10px] text-[13px] text-left",
                    "transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "bg-[#FFF0F0] text-[#E2484D] font-semibold"
                      : "text-[#1B1615] hover:bg-[#FAF7F4] hover:pl-[22px]",
                  ].join(" ")}
                >
                  <span className="flex-1">
                    {renderOption ? renderOption(option) : option}
                  </span>
                  {isSelected && (
                    <Check size={14} strokeWidth={2.5} className="shrink-0 text-[#E2484D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────

function Field({ label, icon: Icon, error, children }: {
  label: string; icon: React.ElementType;
  error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[#403A37]">
        <Icon size={12} strokeWidth={2.5} className="text-[#9E8E85]" />
        {label}
      </label>
      {children}
      <div className="h-4 pt-0.5">
        {error && (
          <p className="text-[11px] font-medium text-[#E2484D]">⚠ {error}</p>
        )}
      </div>
    </div>
  );
}

// ── DonorForm ─────────────────────────────────────────────────────────────

const DonorForm = () => {
  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", phone: "",
    bloodGroup: "", area: "",
    lastDonationDate: "", availability: "",
  });
  const [errors,       setErrors]       = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);

  const setField = (key: keyof FormData) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const setInput = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setField(key)(e.target.value);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName    = "Full name is required.";
    if (!form.email.trim())    e.email       = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim())    e.phone       = "Phone number is required.";
    if (!form.bloodGroup)      e.bloodGroup  = "Select a blood group.";
    if (!form.area)            e.area        = "Select an area.";
    if (!form.availability)    e.availability = "Select availability.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const ic = (f: keyof FormData) => [
    "w-full h-[46px] rounded-[11px] border bg-white px-4",
    "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0]",
    "outline-none transition-all duration-200",
    errors[f]
      ? "border-[#E2484D] ring-2 ring-[#E2484D]/10"
      : "border-[#E0D9D4] hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10 focus:shadow-sm",
  ].join(" ");

  // ── Success ──────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center rounded-[22px] border border-[#EDE7E2] bg-white p-10 text-center shadow-[0_20px_60px_rgba(27,22,21,0.09)]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE4E4] shadow-[0_0_0_10px_rgba(226,72,77,0.08)]">
          <CheckCircle size={40} strokeWidth={1.8} className="text-[#E2484D]" />
        </div>
        <h3 className="mt-6 text-[24px] font-extrabold tracking-[-0.02em] text-[#1B1615]">
          You&apos;re a donor now!
        </h3>
        <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-[#9E8E85]">
          Thank you,{" "}
          <span className="font-semibold text-[#1B1615]">
            {form.fullName.split(" ")[0]}
          </span>
          . Your profile is live — people nearby can now find you.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { icon: Users,       label: "Joined 1,200+ donors" },
            { icon: ShieldCheck, label: "Profile verified"      },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-full border border-[#EDE7E2] bg-[#FAF7F4] px-4 py-2 text-[12px] font-semibold text-[#68625E]">
              <Icon size={13} strokeWidth={2} className="text-[#E2484D]" />
              {label}
            </div>
          ))}
        </div>
        <Link
          href="/"
          className="mt-7 flex h-[48px] items-center gap-2 rounded-[12px] bg-[#E2484D] px-8 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(226,72,77,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D83E43]"
        >
          Back to Home <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full rounded-[22px] border border-[#EDE7E2] bg-white p-6 shadow-[0_20px_60px_rgba(27,22,21,0.09)] sm:p-8">
      <div className="mb-6">
        <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1B1615]">
          Create your donor profile
        </h2>
        <p className="mt-1 text-[12.5px] text-[#9E8E85]">
          Fill in the details below to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-1">

        {/* Full Name */}
        <Field label="Full Name" icon={User} error={errors.fullName}>
          <input type="text" placeholder="Your full name"
            value={form.fullName} onChange={setInput("fullName")}
            className={ic("fullName")} />
        </Field>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Email" icon={Mail} error={errors.email}>
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={setInput("email")}
              className={ic("email")} />
          </Field>
          <Field label="Phone" icon={Phone} error={errors.phone}>
            <input type="tel" placeholder="01XXXXXXXXX"
              value={form.phone} onChange={setInput("phone")}
              className={ic("phone")} />
          </Field>
        </div>

        {/* Blood Group + Area */}
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Blood Group" icon={Droplets} error={errors.bloodGroup}>
            <CustomSelect
              value={form.bloodGroup}
              onChange={setField("bloodGroup")}
              options={BLOOD_GROUPS}
              placeholder="Select blood group"
              hasError={!!errors.bloodGroup}
              // ✅ Fix: Droplets icon in badge — text shown ONCE as label
              renderOption={(o) => (
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#E2484D]">
                    <Droplets size={13} strokeWidth={2} />
                  </span>
                  <span className="font-medium">{o}</span>
                </span>
              )}
              renderValue={(v) => (
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#E2484D]">
                    <Droplets size={11} strokeWidth={2} />
                  </span>
                  {v}
                </span>
              )}
            />
          </Field>

          <Field label="Area" icon={MapPin} error={errors.area}>
            <CustomSelect
              value={form.area}
              onChange={setField("area")}
              options={AREAS}
              placeholder="Select area"
              hasError={!!errors.area}
              renderOption={(o) => (
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0EDEA] text-[#9E8E85]">
                    <MapPin size={13} strokeWidth={2} />
                  </span>
                  <span className="font-medium">{o}</span>
                </span>
              )}
              renderValue={(v) => (
                <span className="flex items-center gap-2">
                  <MapPin size={13} strokeWidth={2} className="shrink-0 text-[#9E8E85]" />
                  {v}
                </span>
              )}
            />
          </Field>
        </div>

        {/* Last Donation Date */}
        <Field label="Last Donation Date (optional)" icon={Calendar} error={errors.lastDonationDate}>
          <input type="date"
            value={form.lastDonationDate} onChange={setInput("lastDonationDate")}
            className={ic("lastDonationDate")} />
        </Field>

        {/* Availability — ✅ now includes 2 months + styled dots */}
        <Field label="Availability" icon={Clock} error={errors.availability}>
          <CustomSelect
            value={form.availability}
            onChange={setField("availability")}
            options={AVAILABILITY}
            placeholder="Select availability"
            hasError={!!errors.availability}
            renderOption={(o) => (
              <span className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${AVAILABILITY_DOT[o] ?? "bg-[#9E8E85]"}`} />
                <span className="font-medium">{o}</span>
              </span>
            )}
            renderValue={(v) => (
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${AVAILABILITY_DOT[v] ?? "bg-[#9E8E85]"}`} />
                {v}
              </span>
            )}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-3 flex h-[50px] w-full items-center justify-center gap-2
            rounded-[12px] bg-[#E2484D] text-[14px] font-semibold text-white
            shadow-[0_8px_24px_rgba(226,72,77,0.22)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:bg-[#D83E43]
            hover:shadow-[0_14px_32px_rgba(226,72,77,0.30)]
            active:translate-y-0 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" />Creating profile…</>
            : <>Create Donor Profile <ArrowRight size={16} strokeWidth={2.3} /></>
          }
        </button>

      </form>
    </div>
  );
};

export default DonorForm;