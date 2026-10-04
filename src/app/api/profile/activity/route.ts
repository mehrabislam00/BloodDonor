import { auth } from "@/lib/auth";
import { database } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const profiles = database.collection("userProfiles");
const privateHeaders = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  const lastActiveAt = new Date();
  await profiles.updateOne(
    { userId: session.user.id },
    {
      $set: { lastActiveAt },
      $setOnInsert: { userId: session.user.id },
    },
    { upsert: true },
  );

  const savedProfile = await profiles.findOne<{ lastActiveAt?: Date }>(
    { userId: session.user.id },
    { projection: { _id: 0, lastActiveAt: 1 } },
  );

  if (!(savedProfile?.lastActiveAt instanceof Date)) {
    return NextResponse.json({ error: "Unable to record activity." }, { status: 500, headers: privateHeaders });
  }

  return NextResponse.json(
    { lastActiveAt: savedProfile.lastActiveAt.getTime() },
    { headers: privateHeaders },
  );
}
