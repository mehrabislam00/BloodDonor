"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, LayoutDashboard, Users, Flag, Settings, LogOut, UserCog, ChevronLeft, ChevronRight, X } from "lucide-react";

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

function SidebarInner({ collapsed, onToggle, onMobileClose, showClose }: Props & { showClose?: boolean }) {
  const pathname = usePathname();
  const active = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Brand */}
      <div className={`flex h-[58px] shrink-0 items-center border-b border-[#EDE7E2] px-4 ${collapsed && !showClose ? "justify-center" : "justify-between"}`}>
        {(!collapsed || showClose) && (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#E2484D] text-white shadow-[0_3px_10px_rgba(226,72,77,0.28)]">
              <Droplets size={15} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14px] font-extrabold tracking-[-0.02em] text-[#1B1615]">Blood<span className="text-[#E2484D]">Donor</span></p>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#C5B8B0]">Admin Panel</p>
            </div>
          </Link>
        )}
        {collapsed && !showClose && (
          <Link href="/admin" className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E2484D] text-white shadow-[0_3px_10px_rgba(226,72,77,0.28)]">
            <Droplets size={15} strokeWidth={2.2} />
          </Link>
        )}
        {showClose ? (
          <button onClick={onMobileClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4]"><X size={13} strokeWidth={2} /></button>
        ) : (
          <button onClick={onToggle} className="hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4] hover:text-[#1B1615] transition-all">
            {collapsed ? <ChevronRight size={13} strokeWidth={2} /> : <ChevronLeft size={13} strokeWidth={2} />}
          </button>
        )}
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
        <Link href="/admin/settings" className={`group mb-0.5 flex items-center rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-[#68625E] transition-all hover:bg-[#FAF7F4] hover:text-[#1B1615] ${collapsed && !showClose ? "justify-center" : "gap-2.5"}`}>
          <Settings size={16} strokeWidth={2} className="text-[#9E8E85] group-hover:text-[#68625E]" />
          {(!collapsed || showClose) && "Settings"}
        </Link>
        <Link href="/admin/login" className={`group flex items-center rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-[#68625E] transition-all hover:bg-[#FFF5F5] hover:text-[#E2484D] ${collapsed && !showClose ? "justify-center" : "gap-2.5"}`}>
          <LogOut size={16} strokeWidth={2} className="text-[#9E8E85] group-hover:text-[#E2484D]" />
          {(!collapsed || showClose) && "Logout"}
        </Link>
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