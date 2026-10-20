import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/layout/BrandLogo";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-auth";

const AdminLoginPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user && await isAdminUser(session.user.id)) {
    redirect("/admin");
  }

  if (session?.user) {
    notFound();
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#FAF7F4] px-4 py-12">

      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#FFE4E4]/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#FFE4E4]/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #E2484D 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Logo ── */}
      <BrandLogo className="relative mb-7" size="small" />

      {/* ── Lock icon + heading ── */}
      <div className="relative mb-7 flex flex-col items-center gap-4 text-center">
        {/* Lock icon circle */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE4E4] shadow-[0_0_0_8px_rgba(226,72,77,0.07)]">
          {/* Custom lock SVG — matches screenshot's open-lock style */}
          <svg
            width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="#E2484D" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        </div>

        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#1B1615]">
            Admin access
          </h1>
          <p className="mt-1.5 text-[13.5px] text-[#9E8E85]">
            Authorized moderators only.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <AdminLoginForm />

      {/* ── Return link ── */}
      <Link
        href="/"
        className="relative mt-6 text-[13px] font-medium text-[#E2484D] transition-colors hover:text-[#C73E43]"
      >
        ← Return to BloodDonor
      </Link>

    </main>
  );
};

export default AdminLoginPage;