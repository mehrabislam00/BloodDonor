"use client";

import React, { useState } from "react";
import type { UserProfile }    from "@/components/user-profile/types";
import ProfileHeader           from "@/components/user-profile/ProfileHeader";
import ProfileInfoCard         from "@/components/user-profile/ProfileInfoCard";
import ProfileCompletionCard   from "@/components/user-profile/ProfileCompletionCard";
import DonorStatusCard         from "@/components/user-profile/DonorStatusCard";
import EditProfileModal        from "@/components/user-profile/EditProfileModal";
import ChangePasswordCard      from "@/components/user-profile/ChangePasswordCard";
import DeleteAccountCard       from "@/components/user-profile/DeleteAccountCard";

interface Props {
  initialUser: UserProfile;
}

export default function UserProfileClient({ initialUser }: Props) {
  const [user,     setUser]     = useState<UserProfile>(initialUser);
  const [showEdit, setShowEdit] = useState(false);

  const handleSave   = (updated: UserProfile) => setUser(updated);
  const handleAvatar = (url: string)          => setUser((u) => ({ ...u, avatarUrl: url }));

  return (
    <div className="flex flex-col gap-5">

      {/* ── Profile header: avatar, name, progress, edit button ── */}
      <ProfileHeader
        user={user}
        onEdit={() => setShowEdit(true)}
        onAvatar={handleAvatar}
      />

      {/* ── Donor status banner (only when isDonor === true) ── */}
      <DonorStatusCard user={user} />

      {/* ── Info + completion side by side ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        <ProfileInfoCard
          user={user}
          onEdit={() => setShowEdit(true)}
        />
        <ProfileCompletionCard
          user={user}
          onEdit={() => setShowEdit(true)}
        />
      </div>

      {/* ── Security section label ── */}
      <div className="mt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#B5A89F]">
          Security
        </p>
      </div>

      {/* ── Change password ── */}
      <ChangePasswordCard />

      {/* ── Danger zone label ── */}
      <div className="mt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E2484D]/60">
          Danger Zone
        </p>
      </div>

      {/* ── Delete account ── */}
      <DeleteAccountCard />

      {/* ── Edit profile modal ── */}
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}