"use client";
import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar }  from "./AdminTopbar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024)
      setCollapsed(c => !c);
    else
      setMobileOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <AdminSidebar
        collapsed={collapsed}   mobileOpen={mobileOpen}
        onToggle={() => setCollapsed(c => !c)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <AdminTopbar collapsed={collapsed} onMenuClick={handleMenuClick} />
      <main className={`pt-[58px] transition-all duration-300 ${collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"}`}>
        <div className="px-5 py-7 lg:px-8">{children}</div>
      </main>
    </div>
  );
}