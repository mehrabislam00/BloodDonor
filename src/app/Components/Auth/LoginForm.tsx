"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

type FormData   = { email: string; password: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

const base   = "w-full h-[44px] rounded-[10px] border bg-[#FAF7F4] pl-10 pr-4 text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none transition-all duration-200";
const normal = "border-[#E8E2DD] hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10 focus:bg-white focus:shadow-sm";
const errCls = "border-[#E2484D] ring-2 ring-[#E2484D]/10 bg-white";

const LoginForm = () => {
  const [form,         setForm]        = useState<FormData>({ email: "", password: "" });
  const [errors,       setErrors]      = useState<FormErrors>({});
  const [showPw,       setShowPw]      = useState(false);
  const [isSubmitting, setIsSubmitting]= useState(false);
  const [isGoogle,     setIsGoogle]    = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e: FormErrors = {};
    if (!form.email.trim())  e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)      e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      // TODO: supabase.auth.signInWithPassword({ email, password })
    } finally { setIsSubmitting(false); }
  };

  const handleGoogle = async () => {
    if (isGoogle) return;
    setIsGoogle(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      // TODO: supabase.auth.signInWithOAuth({ provider: "google" })
    } finally { setIsGoogle(false); }
  };

  const ic = (f: keyof FormData) => `${base} ${errors[f] ? errCls : normal}`;

  return (
    <div className="w-full max-w-[420px]">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold tracking-[-0.028em] text-[#1B1615]">
          Sign in
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#9E8E85]">
          Welcome back — sign in to your account.
        </p>
      </div>

      {/* Google */}
      <button
        type="button" onClick={handleGoogle} disabled={isGoogle}
        className="
          flex h-[46px] w-full items-center justify-center gap-3
          rounded-[11px] border border-[#E0D9D4] bg-white
          text-[13.5px] font-semibold text-[#1B1615] shadow-sm
          transition-all duration-200
          hover:border-[#E2484D]/30 hover:bg-[#FAF7F4] hover:shadow-md
          active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {isGoogle ? <Loader2 size={16} className="animate-spin text-[#9E8E85]" /> : <GoogleIcon />}
        Continue with Google
      </button>

      {/* OR */}
      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EDE7E2]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#C5B8B0]">or</span>
        <div className="h-px flex-1 bg-[#EDE7E2]" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
            Email address
          </label>
          <div className="relative">
            <Mail size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5B8B0]" />
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={set("email")} className={ic("email")} />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] font-medium text-[#E2484D]">⚠ {errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[12.5px] font-semibold text-[#403A37]">Password</label>
            <Link href="/forgot-password" className="text-[12px] font-medium text-[#E2484D] hover:text-[#C73E43] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5B8B0]" />
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password} onChange={set("password")}
              className={`${ic("password")} pr-10`}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C5B8B0] hover:text-[#68625E] transition-colors">
              {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] font-medium text-[#E2484D]">⚠ {errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={isSubmitting}
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
            ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
            : <>Login <ArrowRight size={16} strokeWidth={2.2} /></>}
        </button>

      </form>

      {/* Register prompt */}
      <p className="mt-6 text-center text-[13px] text-[#9E8E85]">
        Don&apos;t have an account?{" "}
        <Link href="/SignUp" className="font-semibold text-[#E2484D] hover:text-[#C73E43] transition-colors">
          Create an account
        </Link>
      </p>

    </div>
  );
};

export default LoginForm;