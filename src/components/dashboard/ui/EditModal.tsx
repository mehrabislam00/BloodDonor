import React from "react";
import { X } from "lucide-react";

interface Props {
  title: string; subtitle?: string;
  onClose: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function EditModal({ title, subtitle, onClose, footer, children }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col rounded-[22px] border border-[#EDE7E2] bg-white shadow-[0_32px_80px_rgba(27,22,21,0.18)]">

        <div className="flex shrink-0 items-center justify-between border-b border-[#F0EAE5] px-7 py-5">
          <div>
            <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1B1615]">{title}</h3>
            {subtitle && <p className="mt-0.5 text-[12.5px] text-[#9E8E85]">{subtitle}</p>}
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] transition-all hover:bg-[#FAF7F4] hover:text-[#1B1615]"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E7E0DB]">
          {children}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#F0EAE5] px-7 py-5">
          <button onClick={onClose}
            className="flex h-[44px] items-center rounded-[10px] border border-[#E0D9D4] bg-white px-6 text-[13.5px] font-semibold text-[#68625E] transition-all hover:bg-[#FAF7F4]"
          >
            Cancel
          </button>
          {footer}
        </div>
      </div>
    </div>
  );
}