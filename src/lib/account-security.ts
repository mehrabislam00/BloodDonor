import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb";

export async function hasCredentialPassword(userId: string): Promise<boolean> {
  const userIds: (string | ObjectId)[] = [userId];
  if (/^[0-9a-fA-F]{24}$/.test(userId)) {
    userIds.push(new ObjectId(userId));
  }

  const account = await database.collection("account").findOne(
    {
      userId: { $in: userIds },
      providerId: "credential",
      password: { $exists: true, $type: "string", $ne: "" },
    },
    { projection: { _id: 1 } },
  );

  return Boolean(account);
}
