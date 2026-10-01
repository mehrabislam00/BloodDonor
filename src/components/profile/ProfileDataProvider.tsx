"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserProfile } from "@/components/user-profile/types";
import { authClient, type AuthSession } from "@/lib/auth-client";

type ProfileDataContextValue = {
  profile: UserProfile | null;
  profileCompletion: number;
  userId: string | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearAccountState: () => Promise<void>;
};

const ProfileDataContext = createContext<ProfileDataContextValue | null>(null);

export function ProfileDataProvider({
  children,
  initialProfile,
  initialProfileCompletion,
  initialSession,
}: {
  children: ReactNode;
  initialProfile: UserProfile | null;
  initialProfileCompletion: number;
  initialSession: AuthSession | null;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [profileCompletion, setProfileCompletion] = useState(initialProfileCompletion);
  const { data: clientSession, isPending, refetch } = authClient.useSession();

  useEffect(() => {
    authClient.hydrateSession(initialSession);
  }, [initialSession]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const next = { ...profile, ...updates };
    const fields = [next.fullName, next.email, next.phone, next.whatsapp, next.area, next.bloodGroup, next.avatarUrl];
    setProfile(next);
    setProfileCompletion(Math.round((fields.filter((value) => typeof value === "string" && value.trim() !== "").length / fields.length) * 100));
  };

  const clearAccountState = async () => {
    await authClient.signOut();
    const { data: verifiedSession, error } = await authClient.getSession();
    if (verifiedSession?.user || (error && error.status !== 401)) {
      throw new Error("Unable to confirm that your session has been cleared.");
    }

    await refetch();
    setProfile(null);
    setProfileCompletion(0);
  };

  const activeSession = isPending ? initialSession : clientSession;
  const activeProfile = activeSession?.user.id === initialSession?.user.id
    ? profile
    : null;

  return (
    <ProfileDataContext.Provider
      value={{
        profile: activeProfile,
        profileCompletion,
        userId: activeSession?.user.id ?? null,
        updateProfile,
        clearAccountState,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
}

export function useProfileData() {
  const value = useContext(ProfileDataContext);
  if (!value) throw new Error("useProfileData must be used within ProfileDataProvider");
  return value;
}
