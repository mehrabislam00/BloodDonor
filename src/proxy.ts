import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/user-profile",
  "/blood-donor-profile",
  "/become-a-donor",
];

const guestRoutes = [
  "/login",
  "/signin",
  "/signup",
  "/forgot-password",
];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => matchesRoute(pathname, route));
  const isGuestRoute = guestRoutes.some((route) => matchesRoute(pathname, route));

  if (!isProtectedRoute && !isGuestRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGuestRoute && session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-profile/:path*",
    "/blood-donor-profile/:path*",
    "/become-a-donor/:path*",
    "/login/:path*",
    "/signin/:path*",
    "/signup/:path*",
    "/forgot-password/:path*",
  ],
};
