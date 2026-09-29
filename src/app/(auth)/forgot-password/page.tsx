import React from "react";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";


const SECURITY_POINTS = [
  { icon: KeyRound,    text: "Link expires in 15 minutes for your security" },
  { icon: ShieldCheck, text: "Only you can reset your password"              },
  { icon: Lock,        text: "Your data is always encrypted and safe"        },
];

const ForgetPass = () => {
  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-[#FAF7F4] py-16 sm:py-20">

        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">

            {/* ── LEFT: static copy ── */}
            <div className="w-full">

              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2484D]/15 bg-[#FFE8E8] px-4 py-2 text-[12px] font-semibold text-[#E2484D]">
                <KeyRound size={13} strokeWidth={2.5} />
                Account recovery
              </div>

              {/* Heading */}
              <h1 className="text-[48px] font-extrabold leading-[1.04] tracking-[-0.035em] text-[#1B1615] sm:text-[58px]">
                Reset your<br />
                <span className="bg-gradient-to-r from-[#E2484D] via-[#D83E43] to-[#B92F35] bg-clip-text text-transparent">
                  password.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-sm text-[14.5px] leading-7 text-[#68625E]">
                Happens to everyone. Enter your email and we&apos;ll send a{" "}
                <span className="font-semibold text-[#1B1615]">secure link</span>{" "}
                to get you back in.
              </p>

              {/* Privacy note */}
              <div className="mt-7 flex items-center gap-3 rounded-[12px] border border-[#E2484D]/15 bg-[#FFE8E8] px-4 py-3">
                <Lock size={14} strokeWidth={2} className="shrink-0 text-[#E2484D]" />
                <p className="text-[12.5px] font-medium text-[#E2484D]">
                  We will never share your email or account info with anyone.
                </p>
              </div>

              {/* Security points */}
              <div className="mt-10 flex flex-col gap-3">
                {SECURITY_POINTS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[13px] text-[#68625E]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#E2484D]">
                      <Icon size={13} strokeWidth={2.5} />
                    </div>
                    {text}
                  </div>
                ))}
              </div>

            </div>

            {/* ── RIGHT: form ── */}
            <div className="flex w-full justify-center lg:justify-end">
              <ForgotPasswordForm />
            </div>

          </div>
        </div>

      </section>
      
    </>
  );
};

export default ForgetPass;