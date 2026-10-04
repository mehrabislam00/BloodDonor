import { cache } from "react";
import { database } from "./mongodb";

export const profileFields = [
  "phone",
  "whatsapp",
  "area",
  "bloodGroup",
  "avatarUrl",
  "dateOfBirth",
  "gender",
  "address",
  "lastDonationDate",
  "isDonor",
  "availability",
] as const;

export type ProfileFields = Partial<{
  [K in (typeof profileFields)[number]]: string | boolean | null;
}> & {
  availableFrom?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function getProfileCompletion(
  profile: ProfileFields,
  fullName: string,
  email: string,
) {
  const fields = [
    fullName,
    email,
    profile.phone,
    profile.whatsapp,
    profile.area,
    profile.bloodGroup,
    profile.avatarUrl,
  ];

  return Math.round(
    (fields.filter((field) => typeof field === "string" && field.trim() !== "").length / fields.length) * 100,
  );
}

const profiles = database.collection("userProfiles");

export const getUserProfile = cache(async (userId: string): Promise<ProfileFields> => {
  const profile = await profiles.findOne<{ userId: string } & ProfileFields>(
    { userId },
    { projection: { _id: 0, userId: 0 } },
  );

  return profile ?? {};
});

export async function updateUserProfile(
  userId: string,
  updates: ProfileFields,
): Promise<ProfileFields> {
  await profiles.updateOne(
    { userId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return getUserProfile(userId);
}
