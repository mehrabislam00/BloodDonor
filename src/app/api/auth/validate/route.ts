import { database } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");
const normalizeEmail = (value: string) => value.trim().toLowerCase();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidName = (value: string) => {
  const name = normalizeName(value);

  if (!name || name.length < 2 || name.length > 60) return false;
  return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9' .-]*$/.test(name);
};

const isValidEmail = (value: string) => {
  const email = normalizeEmail(value);

  if (!email || email.includes(" ")) return false;
  return /^(?!\.)(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email);
};

async function nameExists(name: string) {
  const normalized = normalizeName(name);

  if (!normalized) return false;

  const result = await database.collection("user").findOne({
    name: {
      $regex: new RegExp(`^${escapeRegex(normalized)}$`, "i"),
    },
  });

  return Boolean(result);
}

async function emailExists(email: string) {
  const normalized = normalizeEmail(email);

  if (!normalized) return false;

  const result = await database.collection("user").findOne({
    email: normalized,
  });

  return Boolean(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, value } = body ?? {};

    if (type === "name") {
      const name = normalizeName(String(value ?? ""));

      if (!isValidName(name)) {
        return NextResponse.json({ available: false }, { status: 400 });
      }

      return NextResponse.json({ available: !(await nameExists(name)) });
    }

    if (type === "email") {
      const email = normalizeEmail(String(value ?? ""));

      if (!isValidEmail(email)) {
        return NextResponse.json({ available: false }, { status: 400 });
      }

      return NextResponse.json({ available: !(await emailExists(email)) });
    }

    return NextResponse.json({ available: false }, { status: 400 });
  } catch {
    return NextResponse.json({ available: false }, { status: 400 });
  }
}
