import React from "react";
import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";
import { BloodDropMark } from "@/components/layout/BrandLogo";

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-[58px] w-full items-center justify-between border-b border-[#EDE7E2] bg-white px-6 shadow-[0_1px_8px_rgba(27,22,21,0.05)]">

      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E2484D] text-white shadow-[0_3px_10px_rgba(226,72,77,0.28)]">
          <BloodDropMark className="h-5 w-4 fill-white" />
        </div>
        <span className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1B1615]">
          Blood<span className="text-[#E2484D]">Donor</span>
        </span>
      </Link>

      {/* Right: admin badge + logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full border border-[#EDE7E2] bg-[#FAF7F4] px-3.5 py-1.5">
          <ShieldCheck size={13} strokeWidth={2.2} className="text-[#E2484D]" />
          <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#68625E]">
            Admin
          </span>
        </div>

        <Link
          href="/admin/login"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] transition-all hover:border-[#E2484D]/30 hover:bg-[#FFF5F5] hover:text-[#E2484D]"
          title="Sign out"
        >
          <LogOut size={14} strokeWidth={2} />
        </Link>
      </div>

    </header>
  );
}