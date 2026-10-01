"use client";

// This is the only client boundary for the profile page.
// It owns all interactive state (edit modal open/closed, live user data
// after saves) and passes everything down to the purely presentational
// server-renderable children as props.

import React, { useState } from "react";
import type { UserProfile }     from "./types";
import ProfileHeader            from "./profileHeader";
import EditProfileModal from "./EditProfileModal";
import ProfileCompletionCard from "./ProfileCompletionCard";
import ProfileInfoCard from "./ProfileInfoCard";
import DonorStatusCard from "./DonorStatusCard";
import ChangePasswordCard from "./ChangePasswordCard";


interface Props {
  initialUser: UserProfile;
}

export default function UserProfileClient({ initialUser }: Props) {
  const [user,     setUser]     = useState<UserProfile>(initialUser);
  const [showEdit, setShowEdit] = useState(false);

  const handleSave   = (updated: UserProfile) => setUser(updated);
  const handleAvatar = async (url: string) => {
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url }),
    });

    if (response.ok) {
      setUser((current) => ({ ...current, avatarUrl: url }));
    }
  };

  return (
    <div className="flex flex-col gap-5">

      <ProfileHeader
        user={user}
        onEdit={() => setShowEdit(true)}
        onAvatar={handleAvatar}
      />

      <DonorStatusCard user={user} />

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

      <ChangePasswordCard />

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