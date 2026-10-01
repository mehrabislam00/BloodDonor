import React from "react";
import { Droplets, Pencil, ShieldCheck } from "lucide-react";
import { getInitials } from "./constants";
import type { UserData } from "./types";

interface Props { user: UserData; onEditProfile: () => void; }

export function ProfileCard({ user, onEditProfile }: Props) {
  const ini = getInitials(user.fullName);
  return (
    <div className="rounded-[18px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)]">

      {/* Avatar + name */}
      <div className="flex items-center gap-3.5">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.fullName}
            className="h-14 w-14 shrink-0 rounded-full object-cover shadow-[0_0_0_4px_rgba(226,72,77,0.08)]"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[18px] font-extrabold text-[#E2484D] shadow-[0_0_0_4px_rgba(226,72,77,0.08)]">
            {ini}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[16px] font-extrabold text-[#1B1615]">{user.fullName}</p>
          <p className="text-[12.5px] text-[#9E8E85]">Donor profile</p>
        </div>
      </div>

      {/* Blood group */}
      <div className="mt-5 flex items-center gap-3 rounded-[12px] bg-[#FFF5F5] px-4 py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4]">
          <Droplets size={17} strokeWidth={2} className="text-[#E2484D]" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#B5A89F]">Blood Group</p>
          <p className="text-[22px] font-extrabold tracking-[-0.02em] text-[#E2484D]">{user.bloodGroup || "—"}</p>
        </div>
      </div>

      {/* Active status — replaces profile completion */}
      <div className="mt-5 flex items-center gap-2.5 rounded-[10px] bg-[#EDFAF3] px-4 py-3">
        <ShieldCheck size={15} strokeWidth={2} className="shrink-0 text-[#1A9E56]" />
        <p className="text-[13px] font-semibold text-[#1A9E56]">Donor Profile Active</p>
      </div>

      {/* Edit */}
      <button onClick={onEditProfile}
        className="mt-4 flex h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#E0D9D4] bg-white text-[13.5px] font-semibold text-[#1B1615] transition-all hover:border-[#E2484D]/30 hover:bg-[#FFF5F5] hover:text-[#E2484D]"
      >
        <Pencil size={13} strokeWidth={2.2} />
        Edit Profile
      </button>
    </div>
  );
}