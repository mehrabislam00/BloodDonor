"use client";
import React, { useRef, useState } from "react";
import { DashboardHeader }   from "./DashboardHeader";
import { AvailabilityCard }  from "./AvailabilityCard";
import { ProfileCard }       from "./ProfileCard";
import { StatCards }         from "./StatCards";
import { PersonalInfoCard }  from "./PersonalInfoCard";
import { DonationInfoCard }  from "./DonationInfoCard";
import { EditProfileModal }  from "./EditProfileModal";
import { MOCK_USER, getGreeting } from "./constants";
import type { UserData } from "./types";
import { useProfileData } from "@/components/profile/ProfileDataProvider";
import { toast } from "@/components/toast/ui/toast";

export function DonorDashboard({ initialUser = MOCK_USER }: { initialUser?: UserData }) {
  const { updateProfile } = useProfileData();
  const [user,         setUser]         = useState<UserData>(initialUser);
  const [showFullEdit, setShowFullEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const firstName = user.fullName.split(" ")[0];

  const updateUser = async (patch: Partial<UserData>) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    const previousUser = user;
    const nextUser = { ...user, ...patch };
    setUser(nextUser);

    try {
      const profileResponse = await fetch("/api/profile", {
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
      if (!profileResponse.ok) throw new Error("Unable to save your donor profile.");

      if (nextUser.availability || nextUser.lastDonationDate) {
        const donorResponse = await fetch("/api/donor", {
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
        if (!donorResponse.ok) throw new Error("Unable to save your donor details.");
      }

      updateProfile({
        fullName: nextUser.fullName,
        email: nextUser.email,
        phone: nextUser.phone,
        whatsapp: nextUser.whatsapp,
        bloodGroup: nextUser.bloodGroup,
        area: nextUser.area,
        availability: nextUser.availability,
        avatarUrl: nextUser.photoUrl,
        lastDonationDate: nextUser.lastDonationDate,
        isDonor: true,
      });
      toast.success({ title: "Donor profile updated", description: "Your donor information has been saved." });
    } catch (error) {
      setUser(previousUser);
      toast.error({
        title: "Donor profile update failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      savingRef.current = false;
      setIsSaving(false);
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
            isSaving={isSaving}
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