"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/toast/ui/toast";
import {
  Mail, Lock, Eye, EyeOff,
  Loader2, ArrowRight, ShieldAlert,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────

type FormData   = { email: string; password: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

// ── Shared styles ─────────────────────────────────────────────────────────

const base =
  "w-full h-[46px] rounded-[11px] border bg-[#FAF7F4] pl-10 pr-4 " +
  "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0] " +
  "outline-none transition-all duration-200";

const normal =
  "border-[#E8E2DD] hover:border-[#E2484D]/30 " +
  "focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10 focus:bg-white focus:shadow-sm";

const errStyle = "border-[#E2484D] ring-2 ring-[#E2484D]/10 bg-white";

// ── Component ─────────────────────────────────────────────────────────────

export function AdminLoginForm() {
  const router = useRouter();

  const [form,         setForm]         = useState<FormData>({ email: "", password: "" });
  const [errors,       setErrors]       = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError,    setAuthError]    = useState("");

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      setAuthError("");
      if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
    };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.email.trim())    e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password.trim()) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setAuthError("");

    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/admin",
      });

      if (error) {
        throw new Error(
          error.status >= 500
            ? "We couldn't complete sign in. Please try again."
            : "The email or password you entered is incorrect.",
        );
      }

      const accessResponse = await fetch("/api/admin/access", { cache: "no-store" });
      if (!accessResponse.ok) {
        await authClient.signOut();
        throw new Error(
          accessResponse.status === 403
            ? "This account is not authorized for admin access."
            : "Unable to verify admin access. Please try again.",
        );
      }

      router.push("/admin?login=success");
      router.refresh();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
      toast.error({ title: "Admin sign in failed", description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ic = (f: keyof FormData) => `${base} ${errors[f] ? errStyle : normal}`;

  return (
    <div className="relative w-full max-w-[400px] rounded-[20px] border border-[#EDE7E2] bg-white p-7 shadow-[0_16px_48px_rgba(27,22,21,0.08)]">

      {/* ── Auth error banner ── */}
      {authError && (
        <div className="mb-5 flex items-start gap-3 rounded-[11px] border border-[#FCC5C7] bg-[#FFF5F5] px-4 py-3">
          <ShieldAlert size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-[#E2484D]" />
          <p className="text-[12.5px] font-medium leading-relaxed text-[#9B1C1C]">
            {authError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* ── Email ── */}
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
            Email
          </label>
          <div className="relative">
            <Mail
              size={15} strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0]"
            />
            <input
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              className={ic("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11.5px] font-medium text-[#E2484D]">
              ⚠ {errors.email}
            </p>
          )}
        </div>

        {/* ── Password ── */}
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
            Password
          </label>
          <div className="relative">
            <Lock
              size={15} strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0]"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              autoComplete="current-password"
              value={form.password}
              onChange={set("password")}
              className={`${ic("password")} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5B8B0] transition-colors hover:text-[#68625E]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword
                ? <EyeOff size={15} strokeWidth={2} />
                : <Eye    size={15} strokeWidth={2} />
              }
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11.5px] font-medium text-[#E2484D]">
              ⚠ {errors.password}
            </p>
          )}
        </div>

        {/* ── Sign in button ── */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-1 flex h-[48px] w-full items-center justify-center gap-2
            rounded-[12px] bg-[#E2484D] text-[14px] font-semibold text-white
            shadow-[0_8px_24px_rgba(226,72,77,0.22)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:bg-[#D83E43]
            hover:shadow-[0_12px_30px_rgba(226,72,77,0.30)]
            active:translate-y-0 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in…</>
          ) : (
            <>Sign in <ArrowRight size={16} strokeWidth={2.2} /></>
          )}
        </button>

      </form>

      {/* ── Security note ── */}
      <div className="mt-5 flex items-center gap-2 rounded-[10px] bg-[#FAF7F4] px-4 py-3">
        <Lock size={12} strokeWidth={2} className="shrink-0 text-[#B5A89F]" />
        <p className="text-[11.5px] leading-relaxed text-[#B5A89F]">
          This area is restricted to authorized personnel only.
          Unauthorized access attempts are logged.
        </p>
      </div>

    </div>
  );
}