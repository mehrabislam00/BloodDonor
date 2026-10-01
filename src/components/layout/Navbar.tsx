"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  ChevronDown,
  Droplets,
} from "lucide-react";

// ── Name cleanup ────────────────────────────────────────────────────────────────
const getDisplayName = (raw: string | null | undefined): string => {
  if (!raw) return "User";
  const cleaned = (raw.includes("@") ? raw.split("@")[0] : raw)
    .replace(/_/g, " ")
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const getNavbarName = (fullName: string): string => {
  if (fullName.length <= 20) return fullName;
  return fullName.split(/\s+/)[0];
};

// ── UserDropdown ────────────────────────────────────────────────────────────────
interface UserDropdownProps {
  userName:  string | null | undefined;
  userEmail: string | null | undefined;
  isDonor: boolean;
  profileCompletion: number;
}

const UserDropdown = ({ userName, userEmail, isDonor, profileCompletion }: UserDropdownProps) => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [visible, setVisible] = useState(false);
  const ref                   = useRef<HTMLDivElement>(null);
  const router                = useRouter();
  const displayName           = getDisplayName(userName);
  const navbarName            = getNavbarName(displayName);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    );
  };

  const close = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 180);
  };

  const toggle = () => (isOpen ? close() : open());

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown",   onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown",   onEsc);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    close();
    router.replace("/login");
    router.refresh();
  };

  const menuItems = [
    { label: "My Profile",    icon: User,     href: "/user-profile"   },
    { label: "View Donor Profile", icon: Droplets, href: isDonor ? "/blood-donor-profile" : "/become-a-donor" },
  ];

  return (
    <div ref={ref} className="relative">

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="
          group flex items-center gap-2
          rounded-[10px] p-1 pr-2.5
          outline-none transition-all duration-200
          hover:bg-[#FFF0F0]
          focus-visible:ring-2 focus-visible:ring-[#E2484D]/25
        "
      >
        {/* Avatar */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4]
          transition-all duration-200 group-hover:ring-2 group-hover:ring-[#E2484D]/20
        ">
          {profileCompletion < 100 && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#FDF9F6] bg-[#E2484D]" aria-label="Profile incomplete" />
          )}
          <span className="text-[12px] font-bold uppercase leading-none text-[#E2484D]">
            {displayName.charAt(0)}
          </span>
        </div>

        {/* Name */}
        <div className="hidden flex-col items-start leading-tight sm:flex">
          <span className="text-[10.5px] font-medium text-[#B5A89F]">
            Welcome
          </span>
          <span className="text-[13px] font-semibold text-[#1B1615]">
            {navbarName}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={14}
          strokeWidth={2.2}
          className={`
            hidden shrink-0 transition-all duration-300 sm:block
            ${isOpen
              ? "rotate-180 text-[#E2484D]"
              : "text-[#9E8E85] group-hover:text-[#68625E]"
            }
          `}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className={`
            absolute right-0 top-[calc(100%+10px)] z-50
            w-[220px] overflow-hidden
            rounded-[16px] border border-[#EDE7E2] bg-white
            shadow-[0_16px_48px_rgba(27,22,21,0.13)]
            transition-all duration-[180ms] origin-top-right
            ${visible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-1"
            }
          `}
        >
          {/* User info header */}
          <div className="border-b border-[#F0EAE5] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-full bg-[#FFE4E4]
              ">
                <span className="text-[14px] font-bold uppercase leading-none text-[#E2484D]">
                  {displayName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#1B1615]">
                  {displayName}
                </p>
                {userEmail && (
                  <p className="truncate text-[11px] text-[#9E8E85]">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {profileCompletion < 100 && (
            <Link
              href="/user-profile"
              onClick={close}
              className="mx-3 mb-1 flex items-center justify-between rounded-[10px] bg-[#FFF5F5] px-3 py-2 text-[12px] font-semibold text-[#E2484D]"
            >
              <span>Complete Your Profile</span>
              <span>{profileCompletion}%</span>
            </Link>
          )}

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                onClick={close}
                className="
                  group/item flex items-center gap-3
                  px-4 py-[10px]
                  text-[13px] font-medium text-[#403A37]
                  transition-all duration-150
                  hover:bg-[#FAF7F4] hover:pl-[22px] hover:text-[#1B1615]
                "
              >
                <Icon
                  size={15}
                  strokeWidth={2}
                  className="
                    shrink-0 text-[#9E8E85]
                    transition-colors duration-150
                    group-hover/item:text-[#E2484D]
                  "
                />
                {label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-[#F0EAE5]" />

          {/* Logout */}
          <div className="py-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="
                group/logout flex w-full items-center gap-3
                px-4 py-[10px]
                text-[13px] font-medium text-[#C73E43]
                transition-all duration-150
                hover:bg-[#FFF0F0] hover:pl-[22px]
              "
            >
              <LogOut
                size={15}
                strokeWidth={2}
                className="
                  shrink-0 text-[#E2484D]/60
                  transition-colors duration-150
                  group-hover/logout:text-[#E2484D]
                "
              />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Navbar ──────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const pathname = usePathname();
  const router   = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileSummary, setProfileSummary] = useState({
    isDonor: false,
    profileCompletion: 100,
  });

  const { data: session, isPending } = useSession();
  const userName  = session?.user.name?.trim() || session?.user.email?.split("@")[0] || null;
  const userEmail = session?.user.email ?? null;

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }

    let active = true;
    fetch("/api/profile")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        if (!active || !result) return;
        setProfileSummary({
          isDonor: result.profile?.isDonor === true,
          profileCompletion: typeof result.profileCompletion === "number"
            ? result.profileCompletion
            : 100,
        });
      })
      .catch(() => undefined);

    return () => { active = false; };
  }, [pathname, session?.user.id]);

  const navItems = [
    { label: "Find Donor",     href: "/find-a-donor"   },
    { label: "Become a Donor", href: "/become-a-donor" },
    { label: "About",          href: "/about"           },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleMobileLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    closeMenu();
    router.replace("/login");
    router.refresh();
  };

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-[#E6E0DB]/80
        bg-[#FDF9F6]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          navbar container mx-auto
          min-h-[76px] w-full
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* ==================== LOGO ==================== */}
        <div className="navbar-start">
          <Link
            href="/"
            aria-label="BloodDonor Home"
            onClick={closeMenu}
            className="
              group flex items-center gap-2.5
              rounded-xl transition-all duration-300 ease-out
              hover:-translate-y-[1px]
            "
          >
            <span className="relative flex h-11 w-10 items-center justify-center">
              <span className="
                absolute h-8 w-8 rounded-full bg-[#E2484D]/0 blur-xl
                transition-all duration-500 group-hover:bg-[#E2484D]/30
              " />
              <svg
                viewBox="0 0 40 48"
                className="
                  relative h-11 w-10 fill-[#E2484D]
                  transition-all duration-500 ease-out
                  group-hover:scale-110 group-hover:rotate-[-3deg]
                "
                aria-hidden="true"
              >
                <path d="M20 2 C20 2 4 19 4 30 C4 39.5 11.2 46 20 46 C28.8 46 36 39.5 36 30 C36 19 20 2 20 2Z" />
                <path
                  d="M13 28 C13 23 17 17 19 14 C15 20 12 24 12 29 C12 31 13 33 15 34 C13.7 32.5 13 30.5 13 28Z"
                  fill="white"
                  opacity="0.35"
                />
              </svg>
            </span>

            <span className="text-xl font-bold tracking-[-0.04em] transition-all duration-300">
              <span className="font-medium text-[#1B1615] transition-colors duration-300 group-hover:text-[#2B2523]">
                Blood
              </span>
              <span className="font-medium text-[#E2484D] transition-colors duration-300 group-hover:text-[#C9363C]">
                Donor
              </span>
            </span>
          </Link>
        </div>

        {/* ==================== DESKTOP NAV ==================== */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      group relative flex items-center
                      rounded-xl px-4 py-2.5
                      text-sm font-semibold
                      transition-all duration-300 ease-out
                      ${active
                        ? "bg-[#FFE8E8] text-[#E2484D] shadow-sm"
                        : "text-[#68625E] hover:bg-[#FFF0F0] hover:text-[#E2484D]"
                      }
                    `}
                  >
                    {item.label}
                    <span
                      className={`
                        absolute bottom-[5px] left-1/2 h-[2px]
                        -translate-x-1/2 rounded-full bg-[#E2484D]
                        transition-all duration-300 ease-out
                        ${active
                          ? "w-5 opacity-100"
                          : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                        }
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ==================== DESKTOP ACTIONS ==================== */}
        <div className="navbar-end hidden gap-2.5 lg:flex">
          {isPending ? (
            /* Loading skeleton */
            <div className="h-8 w-32 animate-pulse rounded-[10px] bg-[#F0EAE5]" />
          ) : session ? (
            /* ── Logged in: dropdown ── */
            <UserDropdown
              userName={userName}
              userEmail={userEmail}
              isDonor={profileSummary.isDonor}
              profileCompletion={profileSummary.profileCompletion}
            />
          ) : (
            /* ── Logged out: login button ── */
            <Link href="/login">
              <Button
                variant="ghost"
                className="
                  h-11 rounded-xl border border-transparent
                  px-5 text-sm font-semibold text-[#1B1615]
                  transition-all duration-300 ease-out
                  hover:-translate-y-[1px] hover:border-[#E2484D]/10
                  hover:bg-[#FFE8E8] hover:text-[#E2484D]
                  active:translate-y-0 active:scale-[0.98]
                "
              >
                Login
              </Button>
            </Link>
          )}

          <Link href="/become-a-donor">
            <Button
              className="
                h-11 rounded-xl border border-[#E2484D]/20
                bg-[#E2484D] px-5 text-sm font-semibold text-white
                shadow-[0_6px_18px_rgba(226,72,77,0.18)]
                transition-all duration-300 ease-out
                hover:-translate-y-[2px] hover:border-[#D83E43]
                hover:bg-[#D83E43] hover:shadow-[0_10px_25px_rgba(226,72,77,0.28)]
                active:translate-y-0 active:scale-[0.98] active:shadow-sm
              "
            >
              Become a Donor
              <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Button>
          </Link>
        </div>

        {/* ==================== MOBILE MENU BUTTON ==================== */}
        <div className="navbar-end lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl border border-transparent text-[#1B1615]
              transition-all duration-300
              hover:border-[#E2484D]/10 hover:bg-[#FFE8E8] hover:text-[#E2484D]
              active:scale-95
            "
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ==================== MOBILE MENU ==================== */}
      <div
        className={`
          overflow-hidden border-t border-[#E6E0DB]
          bg-[#FDF9F6] transition-all duration-300 ease-out lg:hidden
          ${isMenuOpen
            ? "max-h-[520px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
          }
        `}
      >
        <div className="container mx-auto px-4 py-4 sm:px-6">

          {/* Mobile nav links */}
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    rounded-xl px-4 py-3
                    text-sm font-semibold
                    transition-all duration-300
                    ${active
                      ? "bg-[#FFE8E8] text-[#E2484D]"
                      : "text-[#1B1615] hover:bg-[#FFF0F0] hover:text-[#E2484D]"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile actions */}
          <div className="mt-4 border-t border-[#E6E0DB] pt-4">
            {isPending ? null : session ? (
              /* ── Logged in mobile ── */
              <div className="flex flex-col gap-2">

                {/* User info chip */}
                <div className="flex items-center gap-3 rounded-xl border border-[#EDE7E2] bg-white px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4]">
                    <span className="text-[13px] font-bold uppercase leading-none text-[#E2484D]">
                      {getDisplayName(userName).charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#1B1615]">
                      {getDisplayName(userName)}
                    </p>
                    {userEmail && (
                      <p className="truncate text-[11px] text-[#9E8E85]">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mobile profile links */}
                <div className="flex flex-col gap-1 rounded-xl border border-[#EDE7E2] bg-white py-1">
                  {[
                    { label: "My Profile",    icon: User,     href: "/user-profile"   },
                    { label: "View Donor Profile", icon: Droplets, href: profileSummary.isDonor ? "/blood-donor-profile" : "/become-a-donor" },
                  ].map(({ label, icon: Icon, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={closeMenu}
                      className="
                        flex items-center gap-3 px-4 py-3
                        text-[13.5px] font-medium text-[#403A37]
                        transition-all duration-150
                        hover:bg-[#FAF7F4] hover:text-[#1B1615]
                      "
                    >
                      <Icon size={15} strokeWidth={2} className="shrink-0 text-[#9E8E85]" />
                      {label}
                    </Link>
                  ))}

                  <div className="mx-3 border-t border-[#F0EAE5]" />

                  <button
                    type="button"
                    onClick={handleMobileLogout}
                    className="
                      flex items-center gap-3 px-4 py-3
                      text-[13.5px] font-medium text-[#C73E43]
                      transition-all duration-150
                      hover:bg-[#FFF0F0]
                    "
                    
                  >
                    <LogOut size={15} strokeWidth={2} className="shrink-0 text-[#E2484D]/60" />
                    Log out
                  </button>
                </div>

                {/* Become a Donor */}
                <Link href="/become-a-donor" onClick={closeMenu}>
                  <Button className="
                    h-11 w-full rounded-xl border border-[#E2484D]/20
                    bg-[#E2484D] text-sm font-semibold text-white
                    shadow-[0_6px_18px_rgba(226,72,77,0.18)]
                    transition-all duration-300
                    hover:-translate-y-[1px] hover:bg-[#D83E43]
                  ">
                    Become a Donor
                  </Button>
                </Link>
              </div>
            ) : (
              /* ── Logged out mobile ── */
              <div className="flex gap-2.5">
                <Link href="/login" onClick={closeMenu} className="flex-1">
                  <Button
                    variant="ghost"
                    className="
                      h-11 w-full rounded-xl border border-[#1B1615]/10
                      text-sm font-semibold text-[#1B1615]
                      transition-all duration-300
                      hover:border-[#E2484D]/10 hover:bg-[#FFE8E8] hover:text-[#E2484D]
                    "
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/become-a-donor" onClick={closeMenu} className="flex-1">
                  <Button className="
                    h-11 w-full rounded-xl border border-[#E2484D]/20
                    bg-[#E2484D] text-sm font-semibold text-white
                    shadow-[0_6px_18px_rgba(226,72,77,0.18)]
                    transition-all duration-300
                    hover:-translate-y-[1px] hover:bg-[#D83E43]
                  ">
                    Become a Donor
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;