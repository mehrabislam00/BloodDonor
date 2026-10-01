"use client";
import React, { useState } from "react";
import { DashboardHeader }   from "./DashboardHeader";
import { AvailabilityCard }  from "./AvailabilityCard";
import { ProfileCard }       from "./ProfileCard";
import { StatCards }         from "./StatCards";
import { PersonalInfoCard }  from "./PersonalInfoCard";
import { DonationInfoCard }  from "./DonationInfoCard";
import { EditProfileModal }  from "./EditProfileModal";
import { MOCK_USER, getGreeting } from "./constants";
import type { UserData } from "./types";

export function DonorDashboard({ initialUser = MOCK_USER }: { initialUser?: UserData }) {
  const [user,         setUser]         = useState<UserData>(initialUser);
  const [showFullEdit, setShowFullEdit] = useState(false);

  const firstName = user.fullName.split(" ")[0];

  const updateUser = async (patch: Partial<UserData>) => {
    const nextUser = { ...user, ...patch };
    setUser(nextUser);

    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: nextUser.fullName,
        phone: nextUser.phone,
        whatsapp: nextUser.whatsapp,
        bloodGroup: nextUser.bloodGroup,
        area: nextUser.area,
        availability: nextUser.availability,
        avatarUrl: nextUser.photoUrl,
        lastDonationDate: nextUser.lastDonationDate,
        isDonor: true,
      }),
    });

    if (nextUser.availability || nextUser.lastDonationDate) {
      await fetch("/api/donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: nextUser.phone,
          whatsapp: nextUser.whatsapp,
          bloodGroup: nextUser.bloodGroup,
          area: nextUser.area,
          availability: nextUser.availability,
          lastDonationDate: nextUser.lastDonationDate,
        }),
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F4]">
      <DashboardHeader greeting={getGreeting(firstName)} />

      <div className="container mx-auto w-full px-4 py-7 sm:px-6 lg:px-8">

        {/* Row 1: Availability + Profile */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          <AvailabilityCard
            user={user}
            onUpdateAvailability={v => updateUser({ availability: v })}
            onToggleContact={() => updateUser({ contactEnabled: !user.contactEnabled })}
            onTurnOff={() => updateUser({ availability: "Unavailable" })}
          />
          <ProfileCard
            user={user}
            onEditProfile={() => setShowFullEdit(true)}
          />
        </div>

        {/* Row 2: Stat cards */}
        <div className="mt-5"><StatCards user={user} /></div>

        {/* Row 3: Personal + Donation info */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PersonalInfoCard  user={user} onSave={data => updateUser(data)} />
          <DonationInfoCard  user={user} onSave={data => updateUser(data)} />
        </div>

      </div>

      {showFullEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowFullEdit(false)}
          onSave={updated => { setUser(updated); setShowFullEdit(false); }}
        />
      )}
    </div>
  );
}