"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Props { value:string; onChange:(v:string)=>void; options:string[]; placeholder?:string; }

export function MiniSelect({ value, onChange, options, placeholder="Select" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o=>!o)}
        className={`flex h-[44px] w-full items-center justify-between gap-2 rounded-[11px] border px-4 text-[13.5px] outline-none transition-all duration-200 ${!value?"text-[#C5B8B0]":"text-[#1B1615]"} ${open?"border-[#E2484D]/60 bg-white ring-2 ring-[#E2484D]/10 shadow-sm":"border-[#E0D9D4] bg-white hover:border-[#E2484D]/40 hover:shadow-sm"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={15} strokeWidth={2} className={`shrink-0 transition-transform duration-200 ${open?"rotate-180 text-[#E2484D]":"text-[#9E8E85]"}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+5px)] z-50 overflow-hidden rounded-[13px] border border-[#EDE7E2] bg-white shadow-[0_16px_48px_rgba(27,22,21,0.14)]">
          <div className="max-h-[200px] overflow-y-auto py-1.5 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E7E0DB]">
            {options.map(opt => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-2 px-4 py-[10px] text-[13px] text-left transition-all duration-150 ${value===opt?"bg-[#FFF0F0] font-semibold text-[#E2484D]":"text-[#1B1615] hover:bg-[#FAF7F4] hover:pl-[22px]"}`}
              >
                {opt}
                {value===opt && <Check size={13} strokeWidth={2.5} className="shrink-0 text-[#E2484D]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}