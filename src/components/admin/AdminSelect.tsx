"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function AdminSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[150px]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-[38px] w-full items-center justify-between gap-3 rounded-[9px] border bg-white px-3 text-left text-[13px] outline-none transition-all ${
          open ? "border-[#E2484D] ring-2 ring-[#E2484D]/10" : "border-[#E0D9D4] hover:border-[#E2484D]/30"
        }`}
      >
        <span className={value ? "text-[#1B1615]" : "text-[#68625E]"}>{value || label}</span>
        <ChevronDown size={13} className={`shrink-0 text-[#9E8E85] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+5px)] z-40 max-h-64 w-full overflow-y-auto rounded-[10px] border border-[#EDE7E2] bg-white p-1 shadow-[0_12px_32px_rgba(27,22,21,0.14)]">
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-[#68625E] hover:bg-[#FFF0F0]"
          >
            {label}
            {!value && <Check size={13} className="text-[#E2484D]" />}
          </button>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setOpen(false); }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-[#403A37] hover:bg-[#FFF0F0] hover:text-[#E2484D]"
            >
              {option}
              {value === option && <Check size={13} className="text-[#E2484D]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
