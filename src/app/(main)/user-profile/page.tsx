// Server Component — no "use client" directive.
// Fetches user data on the server, renders static shell,
// and passes data into the single client boundary.

import type { UserProfile } from "@/components/user-profile/types";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserProfileClient from "@/components/user-profile/UserProfileClient";
import React from "react";


// ── Server-side data fetch ────────────────────────────────────────────────
// Replace this function with your real data source.
// e.g. supabase.auth.getUser() + supabase.from("profiles").select(...)
async function getUser(): Promise<UserProfile> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/login");

  const profile = await getUserProfile(session.user.id);
  return {
    fullName: session.user.name || "",
    email: session.user.email || "",
    phone: typeof profile.phone === "string" ? profile.phone : "",
    whatsapp: typeof profile.whatsapp === "string" ? profile.whatsapp : "",
    area: typeof profile.area === "string" ? profile.area : "",
    bloodGroup: typeof profile.bloodGroup === "string" ? profile.bloodGroup : "",
    avatarUrl: typeof profile.avatarUrl === "string" ? profile.avatarUrl : null,
    dateOfBirth: typeof profile.dateOfBirth === "string" ? profile.dateOfBirth : "",
    gender: typeof profile.gender === "string" ? profile.gender : "",
    address: typeof profile.address === "string" ? profile.address : "",
    isDonor: profile.isDonor === true,
    availability: typeof profile.availability === "string" ? profile.availability : "available",
  };
}

// ── Page (Server Component) ───────────────────────────────────────────────
export default async function UserProfilePage() {
  const user = await getUser();

  return (
    <div className="min-h-screen w-full bg-[#FAF7F4]">

      {/* ── Static page header — pure HTML, zero JS ── */}
      <section className="border-b border-[#EDE7E2] bg-[#faf4f0]">
        <div className="container mx-auto w-full  px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.18em] text-[#E2484D]">
            Account
          </p>
          <h1 className="text-[38px] font-extrabold leading-[1.04] tracking-[-0.03em] text-[#1B1615] sm:text-[48px]">
            Your Profile
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#9E8E85]">
            Manage your account information and track your profile completion.
          </p>
        </div>
      </section>

      {/* ── Body — pass server-fetched data to the client boundary ── */}
      <div className="container mx-auto w-full  px-4 py-8 sm:px-6 lg:px-8 ">
        <UserProfileClient initialUser={user} />
      </div>

    </div>
  );
}