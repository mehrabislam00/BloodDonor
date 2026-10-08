import { auth } from "@/lib/auth";
import { database } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const normalizeNamePart = (value: string) => value.trim().replace(/\s+/g, " ");
const normalizeName = (firstName: string, lastName: string) =>
  `${normalizeNamePart(firstName)} ${normalizeNamePart(lastName)}`.trim();
const normalizeEmail = (value: string) => value.trim().toLowerCase();

const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9' .-]*$/;
const emailPattern = /^(?!\.)(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const isValidName = (value: string) => {
  const name = normalizeNamePart(value);

  if (!name || name.length < 2 || name.length > 60) return false;
  return namePattern.test(name);
};

const isValidEmail = (value: string) => {
  const email = normalizeEmail(value);

  if (!email || email.includes(" ")) return false;
  return emailPattern.test(email);
};

const isStrongPassword = (value: string) => passwordRegex.test(value);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function nameExists(name: string) {
  const normalized = normalizeNamePart(name);

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

    const firstName = typeof body.firstName === "string" ? body.firstName : "";
    const lastName = typeof body.lastName === "string" ? body.lastName : "";
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const terms = Boolean(body.terms);

    const fullName = normalizeName(firstName, lastName);
    const normalizedEmail = normalizeEmail(email);
    const fieldErrors: Record<string, string> = {};

    if (!firstName.trim() || !lastName.trim()) {
      if (!firstName.trim()) fieldErrors.firstName = "First name is required.";
      if (!lastName.trim()) fieldErrors.lastName = "Last name is required.";
    }

    if (fullName && !isValidName(fullName)) {
      fieldErrors.name = "Please enter a valid name.";
    } else if (fullName && (await nameExists(fullName))) {
      fieldErrors.name = "This name is already taken.";
    }

    if (!isValidEmail(normalizedEmail)) {
      fieldErrors.email = "Please enter a valid email address.";
    } else if (await emailExists(normalizedEmail)) {
      fieldErrors.email = "This email is already registered.";
    }

    if (!password) {
      fieldErrors.password = "Password is required.";
    } else if (!isStrongPassword(password)) {
      fieldErrors.password = "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }

    if (!terms) {
      fieldErrors.terms = "You must agree to continue.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { fieldErrors, message: "Please correct the highlighted fields and try again." },
        { status: 422 }
      );
    }

    const result = await auth.api.signUpEmail({
      headers: request.headers,
      body: {
        name: fullName,
        email: normalizedEmail,
        password,
        callbackURL: "/",
      },
    });

    return NextResponse.json({ success: true, user: result.user });
  } catch (error: unknown) {
    const message = error instanceof Error
      ? error.message
      : "Unable to create your account. Please try again.";

    if (/already.*(exists|registered)|already.*taken/i.test(message)) {
      return NextResponse.json(
        { message, fieldErrors: { email: "This email is already registered.", name: "This name is already taken." } },
        { status: 422 }
      );
    }

    return NextResponse.json({ message, fieldErrors: {} }, { status: 422 });
  }
}
