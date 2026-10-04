"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
  const activityWriteRef = useRef({ userId: "", lastRecordedAt: 0, inFlight: false });
  const activeUserId = activeSession?.user.id ?? null;

  useEffect(() => {
    if (!activeUserId) return;
    if (activityWriteRef.current.userId !== activeUserId) {
      activityWriteRef.current = { userId: activeUserId, lastRecordedAt: 0, inFlight: false };
    }

    let active = true;
    const recordActivity = () => {
      if (document.visibilityState !== "visible") return;
      const state = activityWriteRef.current;
      if (state.inFlight || Date.now() - state.lastRecordedAt < 5 * 60 * 1000) return;

      state.inFlight = true;
      void fetch("/api/profile/activity", { method: "POST", keepalive: true })
        .then(async (response) => {
          const result = await response.json() as { error?: string };
          if (!response.ok) throw new Error(result.error || "Unable to record activity.");
          if (active) state.lastRecordedAt = Date.now();
        })
        .catch((error: unknown) => {
          console.error("Unable to record donor activity.", error);
        })
        .finally(() => {
          state.inFlight = false;
        });
    };

    recordActivity();
    window.addEventListener("focus", recordActivity);
    document.addEventListener("visibilitychange", recordActivity);
    window.addEventListener("pointerdown", recordActivity, { passive: true });
    window.addEventListener("keydown", recordActivity);
    return () => {
      active = false;
      window.removeEventListener("focus", recordActivity);
      document.removeEventListener("visibilitychange", recordActivity);
      window.removeEventListener("pointerdown", recordActivity);
      window.removeEventListener("keydown", recordActivity);
    };
  }, [activeUserId]);

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
