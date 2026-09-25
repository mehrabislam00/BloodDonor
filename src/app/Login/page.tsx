import React from "react";
import Link from "next/link";
import LoginForm from "../Components/Auth/LoginForm";
import { Droplets, ShieldCheck, MapPin, Users, Heart } from "lucide-react";

const DONOR_CARDS = [
  { initials: "RH", name: "Rahim Hasan",   blood: "O+",  area: "Mirpur",      available: true  },
  { initials: "NJ", name: "Nusrat Jahan",  blood: "A+",  area: "Dhanmondi",   available: true  },
  { initials: "SK", name: "Samiul Karim",  blood: "B-",  area: "Uttara",      available: true  },
  { initials: "FA", name: "Farzana Akter", blood: "AB+", area: "Mohammadpur", available: false },
];



const LoginPage = () => {
  return (
    <main className="h-screen w-full overflow-hidden lg:flex">

      {/* ══════════════════════════════════════════════════════
          LEFT — Dark visual panel
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative hidden h-full w-[52%] shrink-0 overflow-hidden lg:flex lg:flex-col lg:justify-between"
        style={{ background: "linear-gradient(150deg,#1A0608 0%,#2C1012 45%,#1A0608 100%)" }}
      >
        {/* depth blobs */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(226,72,77,0.22) 0%,transparent 65%)" }} />
        <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(226,72,77,0.14) 0%,transparent 65%)" }} />
        <div className="pointer-events-none absolute bottom-[-60px] left-[-40px] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(185,47,53,0.18) 0%,transparent 65%)" }} />

        {/* cross-hatch texture */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cross-l" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="32" y2="32" stroke="rgba(226,72,77,0.06)" strokeWidth="0.5"/>
              <line x1="32" y1="0" x2="0" y2="32" stroke="rgba(226,72,77,0.06)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cross-l)" />
        </svg>

        {/* ghost drops */}
        <svg className="pointer-events-none absolute right-0 top-[-30px] opacity-[0.055]" width="280" height="340" viewBox="0 0 280 340" fill="none">
          <path d="M140 16C140 16 16 140 16 215C16 281 72 326 140 326C208 326 264 281 264 215C264 140 140 16 140 16Z" fill="#E2484D"/>
        </svg>
        <svg className="pointer-events-none absolute bottom-[-20px] left-[-20px] opacity-[0.045]" width="200" height="240" viewBox="0 0 200 240" fill="none">
          <path d="M100 12C100 12 12 100 12 155C12 202 52 232 100 232C148 232 188 202 188 155C188 100 100 12 100 12Z" fill="#E2484D"/>
        </svg>
        <svg className="pointer-events-none absolute right-10 top-[45%] opacity-[0.04]" width="100" height="122" viewBox="0 0 100 122" fill="none">
          <path d="M50 7C50 7 7 50 7 78C7 101 26 115 50 115C74 115 93 101 93 78C93 50 50 7 50 7Z" fill="#E2484D"/>
        </svg>

        {/* content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#E2484D] shadow-[0_0_22px_rgba(226,72,77,0.55)]">
              <Droplets size={20} strokeWidth={2.2} className="text-white" />
            </div>
            <span className="text-[20px] font-extrabold tracking-[-0.02em] text-white">
              Blood<span className="text-[#E2484D]">Donor</span>
            </span>
          </Link>

          <div className="flex flex-col gap-7">
            <div>
              <p className="mb-3 text-[11px] font-bold tracking-[0.18em] text-[#E2484D]/80">DHAKA'S DONOR COMMUNITY</p>
              <h2 className="text-[44px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white xl:text-[50px]">
                Good to have<br />you back.
              </h2>
              <p className="mt-3 max-w-[300px] text-[14px] leading-[1.75] text-white/45">
                Active donors across Dhaka — one search away when every minute counts.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="mb-0.5 flex items-center gap-2 text-[11px] font-semibold text-white/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A9E56]" />
                Recently active donors
              </p>
              {DONOR_CARDS.map((d) => (
                <div key={d.name} className="flex items-center gap-3 rounded-[14px] px-4 py-3"
                  style={{ background:"rgba(255,255,255,0.055)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(10px)" }}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E2484D]/25 text-[12px] font-bold text-[#E2484D]">
                    {d.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-white">{d.name}</span>
                      <ShieldCheck size={11} strokeWidth={2.5} className="shrink-0 text-[#E2484D]" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/35">
                      <MapPin size={10} strokeWidth={2} />{d.area}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-[#E2484D]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#E2484D]">{d.blood}</span>
                    <span className="flex items-center gap-1 text-[10px] text-white/30">
                      {d.available
                        ? <><span className="h-1.5 w-1.5 rounded-full bg-[#1A9E56]"/>Available</>
                        : <><span className="h-1.5 w-1.5 rounded-full bg-[#9E8E85]"/>Unavailable</>}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            
          </div>

          <p className="text-[11px] text-white/20 mb-20">Free to use · No medical advice · Donors contact directly</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT — Light form panel
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(145deg,#FDF8F5 0%,#FAF4F0 50%,#F5EDE8 100%)" }}
      >
        {/* ── Warm light blobs ── */}
        <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(226,72,77,0.07) 0%,transparent 65%)" }} />
        <div className="pointer-events-none absolute bottom-[-80px] left-[-80px] h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(226,72,77,0.06) 0%,transparent 65%)" }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(255,228,228,0.45) 0%,transparent 60%)" }} />

        {/* ── Subtle dot grid ── */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-r" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="rgba(226,72,77,0.10)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-r)" />
        </svg>

        {/* ── Ghost blood drop top-left ── */}
        <svg className="pointer-events-none absolute left-[-30px] top-[-20px] opacity-[0.06]" width="220" height="270" viewBox="0 0 220 270" fill="none">
          <path d="M110 14C110 14 14 110 14 168C14 220 56 256 110 256C164 256 206 220 206 168C206 110 110 14 110 14Z" fill="#E2484D"/>
        </svg>
        {/* ── Ghost drop bottom-right ── */}
        <svg className="pointer-events-none absolute bottom-[-30px] right-[-20px] opacity-[0.05]" width="180" height="220" viewBox="0 0 180 220" fill="none">
          <path d="M90 10C90 10 10 90 10 138C10 180 46 208 90 208C134 208 170 180 170 138C170 90 90 10 90 10Z" fill="#E2484D"/>
        </svg>
        {/* ── Tiny drop top-right corner ── */}
        <svg className="pointer-events-none absolute right-10 top-[15%] opacity-[0.045]" width="80" height="98" viewBox="0 0 80 98" fill="none">
          <path d="M40 5C40 5 5 40 5 62C5 81 21 93 40 93C59 93 75 81 75 62C75 40 40 5 40 5Z" fill="#E2484D"/>
        </svg>
        {/* ── Tiny drop bottom-left ── */}
        <svg className="pointer-events-none absolute bottom-[18%] left-8 opacity-[0.04]" width="60" height="74" viewBox="0 0 60 74" fill="none">
          <path d="M30 4C30 4 4 30 4 46C4 60 15 70 30 70C45 70 56 60 56 46C56 30 30 4 30 4Z" fill="#E2484D"/>
        </svg>

        {/* ── Decorative ring around form card ── */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: "1px solid rgba(226,72,77,0.08)" }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: "1px solid rgba(226,72,77,0.04)" }} />

        {/* Mobile logo */}
        <Link href="/" className="absolute left-6 top-6 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#E2484D] text-white">
            <Droplets size={18} strokeWidth={2.2} />
          </div>
          <span className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1B1615]">
            Blood<span className="text-[#E2484D]">Donor</span>
          </span>
        </Link>

        {/* Glass form card */}
        <div
          className="relative z-10 w-full max-w-[420px] rounded-[24px] p-8"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.95)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 8px 32px rgba(226,72,77,0.08), 0 32px 64px rgba(27,22,21,0.10)",
          }}
        >
          <LoginForm />
        </div>
      </div>

    </main>
  );
};

export default LoginPage;