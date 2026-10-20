import { blockedAccountResponse, getUserAccess } from "@/lib/user-auth";
import { database } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const REPORT_REASONS = [
  "Invalid Phone Number",
  "Fake or Incorrect Information",
  "Donor Unavailable",
  "Inappropriate Behavior",
  "Misleading Information",
  "Other",
] as const;

export async function POST(request: Request) {
  const { session, blocked } = await getUserAccess(request);
  if (!session?.user || blocked) {
    return NextResponse.json(blocked ? blockedAccountResponse : { error: "Unauthorized" }, { status: blocked ? 403 : 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid report." }, { status: 400 });
  }

  const { donorId, reason, description } = body as Record<string, unknown>;
  if (
    typeof donorId !== "string" ||
    donorId.trim().length === 0 ||
    donorId.length > 256 ||
    typeof reason !== "string" ||
    !REPORT_REASONS.some((allowedReason) => allowedReason === reason) ||
    (description !== undefined && typeof description !== "string") ||
    (typeof description === "string" && description.length > 1000) ||
    (reason === "Other" && (typeof description !== "string" || !description.trim()))
  ) {
    return NextResponse.json({ error: "Invalid report details." }, { status: 400 });
  }

  await database.collection("donorReports").insertOne({
    donorId: donorId.trim(),
    reporterId: session.user.id,
    reason,
    description: typeof description === "string" ? description.trim() : "",
    status: "Pending",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
