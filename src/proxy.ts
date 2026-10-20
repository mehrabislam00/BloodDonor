import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-auth";
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
  const isAdminRoute = matchesRoute(pathname, "/admin");
  const isAdminApiRoute = matchesRoute(pathname, "/api/admin");
  const isProtectedRoute = protectedRoutes.some((route) => matchesRoute(pathname, route));
  const isGuestRoute = guestRoutes.some((route) => matchesRoute(pathname, route));

  if (!isProtectedRoute && !isGuestRoute && !isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (isAdminApiRoute) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await isAdminUser(session.user.id))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    const isAdmin = session?.user ? await isAdminUser(session.user.id) : false;
    const isLoginRoute = pathname === "/admin/login";

    if (isAdmin) {
      return isLoginRoute
        ? NextResponse.redirect(new URL("/admin", request.url))
        : NextResponse.next();
    }

    if (session?.user) {
      if (isLoginRoute) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return isLoginRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

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
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
