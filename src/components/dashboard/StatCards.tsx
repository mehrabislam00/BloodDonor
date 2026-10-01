import React from "react";
import { Droplets, MapPin, Calendar, Clock } from "lucide-react";
import { formatDate } from "./constants";
import type { UserData } from "./types";

function StatCard({ label, value, icon: Icon }: { label:string; value:string; icon:React.ElementType }) {
  return (
    <div className="rounded-[16px] border border-[#EDE7E2] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,22,21,0.08)]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#9E8E85]">{label}</span>
        <Icon size={16} strokeWidth={1.8} className="text-[#E2484D]/70" />
      </div>
      <p className="mt-3 text-[28px] font-extrabold tracking-[-0.025em] text-[#1B1615]">{value}</p>
    </div>
  );
}

export function StatCards({ user }: { user: UserData }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Blood Group"   value={user.bloodGroup || "—"}            icon={Droplets} />
      <StatCard label="Area"          value={user.area || "—"}                  icon={MapPin}   />
      <StatCard label="Last Donation" value={formatDate(user.lastDonationDate)} icon={Calendar} />
      <StatCard label="Last Active"   value="Today"                             icon={Clock}    />
    </div>
  );
}