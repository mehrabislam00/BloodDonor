import { database } from "./mongodb";

export type DonorProfile = {
  userId: string;
  lastDonationDate: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const donors = database.collection<DonorProfile>("donorProfiles");

export async function getDonorProfile(userId: string) {
  return donors.findOne(
    { userId },
    { projection: { _id: 0, userId: 0 } },
  );
}

export async function updateDonorProfile(
  userId: string,
  updates: Pick<DonorProfile, "lastDonationDate">,
) {
  await donors.updateOne(
    { userId },
    {
      $set: { ...updates, updatedAt: new Date() },
      $setOnInsert: { userId, createdAt: new Date() },
    },
    { upsert: true },
  );

  return getDonorProfile(userId);
}

export async function deleteDonorProfile(userId: string): Promise<void> {
  await donors.deleteOne({ userId });
}