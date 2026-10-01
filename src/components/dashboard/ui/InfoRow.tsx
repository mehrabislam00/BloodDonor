import React from "react";

interface Props { icon: React.ElementType; label: string; value: string; }

export function InfoRow({ icon: Icon, label, value }: Props) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F4]">
        <Icon size={15} strokeWidth={1.9} className="text-[#9E8E85]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-medium text-[#B5A89F]">{label}</p>
        <p className="mt-0.5 truncate text-[14px] font-semibold text-[#1B1615]">{value || "—"}</p>
      </div>
    </div>
  );
}