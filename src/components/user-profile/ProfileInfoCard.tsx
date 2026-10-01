"use client";

import React from "react";
import {
  User, Mail, Phone, MessageCircle,
  MapPin, Droplets, Pencil,
} from "lucide-react";
import type { UserProfile } from "./types";

interface Props {
  user:   UserProfile;
  onEdit: () => void;
}

function InfoRow({
  icon: Icon, label, value, empty,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  empty?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F4]">
        <Icon size={15} strokeWidth={1.9} className="text-[#9E8E85]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-medium text-[#B5A89F]">{label}</p>
        <p className={[
          "mt-0.5 truncate text-[14px] font-semibold",
          empty ? "italic text-[#C5B8B0]" : "text-[#1B1615]",
        ].join(" ")}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfileInfoCard({ user, onEdit }: Props) {
  const rows: {
    icon:  React.ElementType;
    label: string;
    value: string;
  }[] = [
    { icon: User,          label: "Full Name",       value: user.fullName   },
    { icon: Mail,          label: "Email",            value: user.email      },
    { icon: Phone,         label: "Phone",            value: user.phone      },
    { icon: MessageCircle, label: "WhatsApp",         value: user.whatsapp   },
    { icon: MapPin,        label: "Area",             value: user.area       },
    { icon: Droplets,      label: "Blood Group",      value: user.bloodGroup },
  ];

  return (
    <div className="rounded-[20px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(27,22,21,0.08)]">

      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold tracking-[-0.015em] text-[#1B1615]">
          Personal Information
        </h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-[#E2484D] transition-all hover:bg-[#FFF0F0]"
        >
          <Pencil size={11} strokeWidth={2.5} />
          Edit
        </button>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#F5EFE9]">
        {rows.map(({ icon, label, value }) => (
          <InfoRow
            key={label}
            icon={icon}
            label={label}
            value={value || "Not added"}
            empty={!value}
          />
        ))}
      </div>
    </div>
  );
}