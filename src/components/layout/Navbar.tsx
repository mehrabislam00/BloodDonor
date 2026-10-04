"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  ChevronDown,
  Droplets,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/toast/ui/toast";
import { useProfileData } from "@/components/profile/ProfileDataProvider";
import type { AuthSession } from "@/lib/auth-client";

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

const UserAvatar = ({ imageUrl, displayName, textClassName }: {
  imageUrl: string | null;
  displayName: string;
  textClassName: string;
}) => {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  if (imageUrl && failedImageUrl !== imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={40}
        height={40}
        unoptimized
        className="h-full w-full rounded-full object-cover"
        onError={() => setFailedImageUrl(imageUrl)}
      />
    );
  }

  return (
    <span className={textClassName}>
      {displayName.charAt(0)}
    </span>
  );
};

// ── UserDropdown ────────────────────────────────────────────────────────────────
interface UserDropdownProps {
  userName:  string | null | undefined;
  userEmail: string | null | undefined;
  userImage: string | null;
  isDonor: boolean;
  profileCompletion: number;
}

const UserDropdown = ({ userName, userEmail, userImage, isDonor, profileCompletion }: UserDropdownProps) => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        console.error("Logout failed:", error);
        toast.error({ title: "Logout Failed", description: "We couldn't sign you out. Please try again." });
        return;
      }

      toast.success({
        title: "Logout Successful",
        description: "You have been successfully signed out.",
        duration: 5500,
      });
      close();
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error({ title: "Logout Failed", description: "We couldn't sign you out. Please try again." });
    } finally {
      setIsLoggingOut(false);
    }
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
          <UserAvatar
            imageUrl={userImage}
            displayName={displayName}
            textClassName="text-[12px] font-bold uppercase leading-none text-[#E2484D]"
          />
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
                <UserAvatar
                  imageUrl={userImage}
                  displayName={displayName}
                  textClassName="text-[14px] font-bold uppercase leading-none text-[#E2484D]"
                />
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
              className="mx-3 mb-2 mt-1 flex items-center justify-between rounded-[10px] bg-[#FFF5F5] px-4 py-2.5 text-[12px] font-semibold text-[#E2484D]"
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
              disabled={isLoggingOut}
              className="
                group/logout flex w-full items-center gap-3
                px-4 py-[10px]
                text-[13px] font-medium text-[#C73E43]
                transition-all duration-150
                hover:bg-[#FFF0F0] hover:pl-[22px]
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {isLoggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut
                size={15}
                strokeWidth={2}
                className="
                  shrink-0 text-[#E2484D]/60
                  transition-colors duration-150
                  group-hover/logout:text-[#E2484D]
                "
              />}
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Navbar ──────────────────────────────────────────────────────────────────────
const Navbar = ({ initialSession }: { initialSession: AuthSession | null }) => {
  const pathname = usePathname();
  const router   = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileLoggingOut, setIsMobileLoggingOut] = useState(false);
  const { profile, profileCompletion } = useProfileData();
  const { data: clientSession, isPending } = useSession();
  const session = isPending ? initialSession : clientSession;
  const sessionPending = isPending && !initialSession;
  const userName  = profile?.fullName.trim() || session?.user.name?.trim() || session?.user.email?.split("@")[0] || null;
  const userEmail = profile?.email || session?.user.email || null;
  const userImage = profile?.avatarUrl?.trim() || session?.user.image?.trim() || null;
  const isDonor = profile?.isDonor === true;

  const navItems = [
    { label: "Find Donor",     href: "/find-a-donor"   },
    { label: "Become a Donor", href: "/become-a-donor" },
    { label: "About",          href: "/about"           },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleMobileLogout = async () => {
    if (isMobileLoggingOut) return;
    setIsMobileLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        console.error("Logout failed:", error);
        toast.error({ title: "Logout Failed", description: "We couldn't sign you out. Please try again." });
        return;
      }

      toast.success({
        title: "Logout Successful",
        description: "You have been successfully signed out.",
        duration: 5500,
      });
      closeMenu();
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error({ title: "Logout Failed", description: "We couldn't sign you out. Please try again." });
    } finally {
      setIsMobileLoggingOut(false);
    }
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
          <BrandLogo onClick={closeMenu} />
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
          {sessionPending ? (
            /* Loading skeleton */
            <div className="h-8 w-32 animate-pulse rounded-[10px] bg-[#F0EAE5]" />
          ) : session ? (
            /* ── Logged in: dropdown ── */
            <UserDropdown
              userName={userName}
              userEmail={userEmail}
              userImage={userImage}
              isDonor={isDonor}
              profileCompletion={profileCompletion}
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
            {sessionPending ? null : session ? (
              /* ── Logged in mobile ── */
              <div className="flex flex-col gap-2">

                {/* User info chip */}
                <div className="flex items-center gap-3 rounded-xl border border-[#EDE7E2] bg-white px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4]">
                    <UserAvatar
                      imageUrl={userImage}
                      displayName={getDisplayName(userName)}
                      textClassName="text-[13px] font-bold uppercase leading-none text-[#E2484D]"
                    />
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
                    { label: "View Donor Profile", icon: Droplets, href: isDonor ? "/blood-donor-profile" : "/become-a-donor" },
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
                    disabled={isMobileLoggingOut}
                    className="
                      flex items-center gap-3 px-4 py-3
                      text-[13.5px] font-medium text-[#C73E43]
                      transition-all duration-150
                      hover:bg-[#FFF0F0]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                    
                  >
                    {isMobileLoggingOut
                      ? <Loader2 size={15} className="animate-spin" />
                      : <LogOut size={15} strokeWidth={2} className="shrink-0 text-[#E2484D]/60" />}
                    {isMobileLoggingOut ? "Logging out..." : "Log out"}
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