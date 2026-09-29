"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail, Loader2, ArrowRight,
  CheckCircle, ArrowLeft, RefreshCw,
} from "lucide-react";

type FormErrors = { email?: string };

const base   = "w-full h-[44px] rounded-[10px] border bg-[#FAF7F4] pl-10 pr-4 text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none transition-all duration-200";
const normal = "border-[#E8E2DD] hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10 focus:bg-white focus:shadow-sm";
const errCls = "border-[#E2484D] ring-2 ring-[#E2484D]/10 bg-white";

const ForgotPasswordForm = () => {
  const [email,        setEmail]       = useState("");
  const [errors,       setErrors]      = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting]= useState(false);
  const [isResending,  setIsResending] = useState(false);
  const [isSuccess,    setIsSuccess]   = useState(false);

  const validate = () => {
    const e: FormErrors = {};
    if (!email.trim())                     e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      // TODO: supabase.auth.resetPasswordForEmail(email)
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      // TODO: resend
    } finally {
      setIsResending(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="w-full max-w-[420px]">

        {/* Icon */}
        <div className="mb-7 flex justify-center">
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#FFE4E4] shadow-[0_0_0_14px_rgba(226,72,77,0.08)]">
            <CheckCircle size={36} strokeWidth={1.8} className="text-[#E2484D]" />
          </div>
        </div>

        {/* Copy */}
        <div className="mb-6 text-center">
          <h1 className="text-[26px] font-extrabold tracking-[-0.028em] text-[#1B1615]">
            Check your inbox
          </h1>
          <p className="mt-2 text-[13.5px] leading-6 text-[#9E8E85]">
            We sent a password reset link to{" "}
            <span className="font-semibold text-[#1B1615]">{email}</span>.
            Click the link in that email to reset your password.
          </p>
        </div>

        {/* Info note */}
        <div className="mb-6 rounded-[12px] border border-[#E2484D]/15 bg-[#FFE8E8] px-4 py-3">
          <p className="text-[12.5px] font-medium leading-5 text-[#E2484D]">
            Didn&apos;t get it? Check your spam folder or wait a moment before requesting another.
          </p>
        </div>

        {/* Resend */}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="
            mb-3 flex h-[48px] w-full items-center justify-center gap-2
            rounded-[11px] bg-[#E2484D] text-[14px] font-semibold text-white
            shadow-[0_8px_24px_rgba(226,72,77,0.22)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:bg-[#D83E43]
            hover:shadow-[0_14px_32px_rgba(226,72,77,0.30)]
            active:translate-y-0 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isResending
            ? <><Loader2 size={16} className="animate-spin" /> Resending…</>
            : <><RefreshCw size={15} strokeWidth={2.2} /> Resend email</>}
        </button>

        {/* Back to login */}
        <Link
          href="/Login"
          className="
            flex h-[44px] w-full items-center justify-center gap-2
            rounded-[11px] border border-[#E0D9D4] bg-white
            text-[13.5px] font-semibold text-[#403A37] shadow-sm
            transition-all duration-200
            hover:border-[#E2484D]/30 hover:bg-[#FAF7F4]
          "
        >
          <ArrowLeft size={15} strokeWidth={2.2} />
          Back to Login
        </Link>

      </div>
    );
  }

  // ── Default state ──────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-[420px]">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold tracking-[-0.028em] text-[#1B1615]">
          Forgot password?
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#9E8E85]">
          No worries — enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
            Email address
          </label>
          <div className="relative">
            <Mail
              size={15} strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5B8B0]"
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              className={`${base} ${errors.email ? errCls : normal}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] font-medium text-[#E2484D]">
              ⚠ {errors.email}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-1 flex h-[48px] w-full items-center justify-center gap-2
            rounded-[11px] bg-[#E2484D] text-[14px] font-semibold text-white
            shadow-[0_8px_24px_rgba(226,72,77,0.22)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:bg-[#D83E43]
            hover:shadow-[0_14px_32px_rgba(226,72,77,0.30)]
            active:translate-y-0 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
            : <>Send Reset Link <ArrowRight size={16} strokeWidth={2.2} /></>}
        </button>

      </form>

      {/* Back to login */}
      <div className="mt-3">
        <Link
          href="/Login"
          className="
            flex h-[44px] w-full items-center justify-center gap-2
            rounded-[11px] border border-[#E0D9D4] bg-white
            text-[13.5px] font-semibold text-[#403A37] shadow-sm
            transition-all duration-200
            hover:border-[#E2484D]/30 hover:bg-[#FAF7F4]
          "
        >
          <ArrowLeft size={15} strokeWidth={2.2} />
          Back to Login
        </Link>
      </div>

      <p className="mt-6 text-center text-[13px] text-[#9E8E85]">
        Don&apos;t have an account?{" "}
        <Link
          href="/SignUp"
          className="font-semibold text-[#E2484D] hover:text-[#C73E43] transition-colors"
        >
          Create an account
        </Link>
      </p>

    </div>
  );
};

export default ForgotPasswordForm;