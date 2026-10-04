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
import { createAvailabilityRecord, getAvailabilityState } from "@/lib/availability";

export function DonorDashboard({ initialUser = MOCK_USER }: { initialUser?: UserData }) {
  const { updateProfile } = useProfileData();
  const [user,         setUser]         = useState<UserData>(initialUser);
  const [showFullEdit, setShowFullEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const firstName = user.fullName.split(" ")[0];

  const updateUser = async (patch: Partial<UserData>): Promise<boolean> => {
    if (savingRef.current) return false;
    savingRef.current = true;
    setIsSaving(true);
    const previousUser = user;
    const availabilityRecord = patch.availability
      ? createAvailabilityRecord(patch.availability)
      : null;
    const nextUser = {
      ...user,
      ...patch,
      ...(availabilityRecord ?? {}),
    };
    nextUser.contactEnabled = getAvailabilityState(
      nextUser.availability,
      nextUser.availableFrom,
    ).available;
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
      const profileResult = await profileResponse.json() as {
        error?: string;
        profile?: { lastDonationDate?: unknown };
      };
      if (!profileResponse.ok) {
        throw new Error(profileResult.error || "Unable to save your donor profile.");
      }
      const savedUser = {
        ...nextUser,
        lastDonationDate: typeof profileResult.profile?.lastDonationDate === "string"
          ? profileResult.profile.lastDonationDate
          : nextUser.lastDonationDate,
      };
      setUser(savedUser);

      updateProfile({
        fullName: savedUser.fullName,
        email: savedUser.email,
        phone: savedUser.phone,
        whatsapp: savedUser.whatsapp,
        bloodGroup: savedUser.bloodGroup,
        area: savedUser.area,
        availability: savedUser.availability,
        availableFrom: savedUser.availableFrom,
        avatarUrl: savedUser.photoUrl,
        lastDonationDate: savedUser.lastDonationDate,
        isDonor: true,
      });
      toast.success({ title: "Donor profile updated", description: "Your donor information has been saved." });
      return true;
    } catch (error) {
      setUser(previousUser);
      toast.error({
        title: "Donor profile update failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
      return false;
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
            onToggleContact={() => updateUser({
              availability: getAvailabilityState(user.availability, user.availableFrom).available
                ? "Unavailable"
                : "Available Now",
            })}
            onTurnOff={() => updateUser({
              availability: getAvailabilityState(user.availability, user.availableFrom).available
                ? "Unavailable"
                : "Available Now",
            })}
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
          <PersonalInfoCard  user={user} onSave={data => { void updateUser(data); }} />
          <DonationInfoCard  user={user} onSave={data => updateUser(data)} />
        </div>

      </div>

      {showFullEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowFullEdit(false)}
          onSave={async updated => {
            const saved = await updateUser(updated);
            if (saved) setShowFullEdit(false);
            return saved;
          }}
        />
      )}
    </div>
  );
}