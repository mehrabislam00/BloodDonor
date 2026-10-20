"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Search, ChevronDown, User, LogOut, Settings, X } from "lucide-react";
import Link from "next/link";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/donors": "Donor Management",
  "/admin/users": "User Management",
  "/admin/reports": "Community Reports",
  "/admin/settings": "Settings",
};

const NOTIFS = [
  { id:1, text:"New report submitted for Farzana Akter", time:"2 min ago",  unread:true  },
  { id:2, text:"Donor Samiul Karim flagged for review",  time:"15 min ago", unread:true  },
  { id:3, text:"5 new donors registered today",          time:"1 hr ago",   unread:false },
];

function useOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  });
}

interface Props { collapsed: boolean; onMenuClick: () => void; }

export function AdminTopbar({ collapsed, onMenuClick }: Props) {
  const pathname = usePathname();
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const notifRef   = useRef<HTMLDivElement>(null!);
  const profileRef = useRef<HTMLDivElement>(null!);
  useOutside(notifRef,   () => setNotifOpen(false));
  useOutside(profileRef, () => setProfileOpen(false));

  const title      = TITLES[pathname] ?? "Admin Panel";
  const unread     = NOTIFS.filter(n => n.unread).length;
  const breadcrumb = pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1));

  return (
    <header className={`fixed top-0 right-0 z-20 flex h-[58px] items-center justify-between border-b border-[#EDE7E2] bg-white px-4 transition-all duration-300 left-0 ${collapsed ? "lg:left-[72px]" : "lg:left-[240px]"}`}>

      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4] hover:text-[#1B1615] transition-all">
          <Menu size={16} strokeWidth={2} />
        </button>
        <div className="hidden sm:block">
          <p className="text-[10px] font-medium text-[#C5B8B0]">{breadcrumb.join(" / ")}</p>
          <h2 className="text-[14.5px] font-extrabold tracking-[-0.015em] text-[#1B1615] leading-tight">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search — desktop inline */}
        <div className="hidden md:flex h-[34px] items-center gap-2 rounded-[9px] border border-[#EDE7E2] bg-[#FAF7F4] px-3 w-[200px]">
          <Search size={13} strokeWidth={2} className="text-[#C5B8B0]" />
          <span className="text-[13px] text-[#C5B8B0]">Search...</span>
        </div>
        {/* Mobile search icon */}
        <button onClick={() => setSearchOpen(o=>!o)} className="flex md:hidden h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4] transition-all">
          {searchOpen ? <X size={15} strokeWidth={2} /> : <Search size={15} strokeWidth={2} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => { setNotifOpen(o=>!o); setProfileOpen(false); }} className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4] hover:text-[#1B1615] transition-all">
            <Bell size={15} strokeWidth={2} />
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#E2484D] text-[8.5px] font-bold text-white">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[300px] rounded-[14px] border border-[#EDE7E2] bg-white shadow-[0_16px_48px_rgba(27,22,21,0.12)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#F0EAE5] px-4 py-3">
                <p className="text-[13px] font-extrabold text-[#1B1615]">Notifications</p>
                <span className="rounded-full bg-[#FFF0F0] px-2 py-0.5 text-[10.5px] font-bold text-[#E2484D]">{unread} new</span>
              </div>
              {NOTIFS.map(n => (
                <div key={n.id} className={`cursor-pointer px-4 py-3 hover:bg-[#FAF7F4] ${n.unread ? "bg-[#FFFDF9]" : ""}`}>
                  {n.unread && <span className="mb-1 inline-block h-1.5 w-1.5 rounded-full bg-[#E2484D]" />}
                  <p className="text-[12.5px] leading-relaxed text-[#1B1615]">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-[#B5A89F]">{n.time}</p>
                </div>
              ))}
              <div className="border-t border-[#F0EAE5] px-4 py-2.5 text-center">
                <button className="text-[12px] font-semibold text-[#E2484D] hover:text-[#C73E43]">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => { setProfileOpen(o=>!o); setNotifOpen(false); }} className="flex items-center gap-2 rounded-[10px] border border-[#EDE7E2] bg-[#FAF7F4] px-3 py-1.5 text-[13px] font-semibold text-[#1B1615] hover:bg-[#FFF5F5] transition-all">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE4E4] text-[10px] font-extrabold text-[#E2484D]">A</div>
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown size={12} strokeWidth={2.5} className="text-[#9E8E85]" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[190px] overflow-hidden rounded-[13px] border border-[#EDE7E2] bg-white shadow-[0_16px_48px_rgba(27,22,21,0.12)]">
              <div className="border-b border-[#F0EAE5] px-4 py-3">
                <p className="text-[13px] font-bold text-[#1B1615]">Admin User</p>
                <p className="text-[11.5px] text-[#9E8E85]">admin@blooddonor.com</p>
              </div>
              <div className="py-1.5">
                {[{ icon:User, label:"Profile", red:false },{ icon:Settings, label:"Settings", red:false },{ icon:LogOut, label:"Logout", red:true }].map(({icon:Icon,label,red}) => (
                  <button key={label} className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] transition-all ${red ? "text-[#E2484D] hover:bg-[#FFF5F5]" : "text-[#68625E] hover:bg-[#FAF7F4] hover:text-[#1B1615]"}`}>
                    <Icon size={13} strokeWidth={2} /> {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}