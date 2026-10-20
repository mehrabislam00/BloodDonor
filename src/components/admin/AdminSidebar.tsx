"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/toast/ui/toast";
import { LayoutDashboard, Users, Flag, LogOut, UserCog, X } from "lucide-react";
import { BloodDropMark } from "@/components/layout/BrandLogo";

const NAV = [
  { section: "Overview",   items: [{ label: "Dashboard", href: "/admin",         icon: LayoutDashboard }] },
  { section: "Management", items: [
    { label: "Donors",  href: "/admin/donors",  icon: Users   },
    { label: "Users",   href: "/admin/users",   icon: UserCog },
    { label: "Reports", href: "/admin/reports", icon: Flag    },
  ]},
];

interface Props {
  collapsed: boolean; mobileOpen: boolean;
  onToggle: () => void; onMobileClose: () => void;
}

function AdminBrand({ collapsed, showClose }: { collapsed: boolean; showClose?: boolean }) {
  if (collapsed && !showClose) {
    return (
      <Link href="/admin" aria-label="BloodDonor Admin" className="flex h-9 w-9 items-center justify-center">
        <BloodDropMark className="h-8 w-7 fill-[#E2484D]" />
      </Link>
    );
  }

  return (
    <Link href="/admin" aria-label="BloodDonor Admin" className="flex items-center gap-2.5">
      <BloodDropMark className="h-9 w-7 shrink-0 fill-[#E2484D]" />
      <div>
        <p className="text-[16px] font-medium tracking-[-0.03em] text-[#1B1615]">Blood<span className="text-[#E2484D]">Donor</span></p>
        <p className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.2em] text-[#E2484D]">Administration</p>
      </div>
    </Link>
  );
}

function SidebarInner({ collapsed, onToggle, onMobileClose, showClose }: Props & { showClose?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const active = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error({ title: "Logout failed", description: "We couldn't sign you out. Please try again." });
        return;
      }
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error({ title: "Logout failed", description: "We couldn't sign you out. Please try again." });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Brand */}
      <div className={`flex h-[58px] shrink-0 items-center border-b border-[#EDE7E2] px-4 ${collapsed && !showClose ? "justify-center" : "justify-between"}`}>
        <AdminBrand collapsed={collapsed} showClose={showClose} />
        {showClose ? (
          <button onClick={onMobileClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4]"><X size={13} strokeWidth={2} /></button>
        ) : null}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-5">
            {(!collapsed || showClose) && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C5B8B0]">{section}</p>
            )}
            {items.map(({ label, href, icon: Icon }) => {
              const isActive = active(href);
              return (
                <Link key={href} href={href} title={collapsed && !showClose ? label : undefined}
                  className={`group mb-0.5 flex items-center rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 ${collapsed && !showClose ? "justify-center" : "gap-2.5"} ${isActive ? "bg-[#FFF0F0] font-semibold text-[#E2484D]" : "text-[#68625E] hover:bg-[#FAF7F4] hover:text-[#1B1615]"}`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.4 : 2} className={isActive ? "text-[#E2484D]" : "text-[#9E8E85] group-hover:text-[#68625E]"} />
                  {(!collapsed || showClose) && <span>{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-[#EDE7E2] px-3 py-3">
        <button type="button" onClick={() => void handleLogout()} disabled={isLoggingOut} className={`group flex w-full items-center rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-medium text-[#68625E] transition-all hover:bg-[#FFF5F5] hover:text-[#E2484D] disabled:cursor-wait disabled:opacity-60 ${collapsed && !showClose ? "justify-center" : "gap-2.5"}`}>
          <LogOut size={16} strokeWidth={2} className="text-[#9E8E85] group-hover:text-[#E2484D]" />
          {(!collapsed || showClose) && (isLoggingOut ? "Logging out..." : "Logout")}
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: Props) {
  return (
    <>
      {/* Desktop */}
      <aside className={`fixed left-0 top-0 z-30 hidden h-screen border-r border-[#EDE7E2] bg-white transition-all duration-300 lg:block ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
        <SidebarInner collapsed={collapsed} mobileOpen={mobileOpen} onToggle={onToggle} onMobileClose={onMobileClose} />
      </aside>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-[240px] border-r border-[#EDE7E2] bg-white shadow-[4px_0_24px_rgba(27,22,21,0.12)]">
            <SidebarInner collapsed={false} mobileOpen={mobileOpen} onToggle={onToggle} onMobileClose={onMobileClose} showClose />
          </aside>
        </div>
      )}
    </>
  );
}