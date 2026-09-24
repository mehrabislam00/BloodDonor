"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2, MapPin, Droplets, ChevronDown, Check, Clock } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AREAS = [
  "Dhanmondi", "Mirpur", "Uttara", "Gulshan",
  "Mohammadpur", "Banani", "Motijheel", "Farmgate",
];

const AVAILABILITY_OPTIONS = [
  { value: "all",    label: "All donors",      dot: ""            },
  { value: "now",    label: "Available now",   dot: "bg-[#1A9E56]"},
  { value: "recent", label: "Recently active", dot: "bg-[#F59E0B]"},
];

type SearchErrors = {
  bloodGroup?: string;
  area?: string;
};

// ── CustomSelect ──────────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder: string;
  hasError?: boolean;
  renderOption: (o: SelectOption) => React.ReactNode;
  renderValue:  (o: SelectOption) => React.ReactNode;
}

function CustomSelect({
  value, onChange, options, placeholder,
  hasError, renderOption, renderValue,
}: SelectProps) {
  const [isOpen,  setIsOpen]  = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };
  const close = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 180);
  };
  const toggle = () => (isOpen ? close() : open());

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown",   onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown",   onEsc);
    };
  });

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={toggle}
        className={[
          "group w-full h-[48px] rounded-[11px] border bg-white px-4",
          "flex items-center justify-between gap-2 cursor-pointer",
          "text-[14px] outline-none transition-all duration-200",
          hasError
            ? "border-[#E2484D] ring-2 ring-[#E2484D]/10"
            : isOpen
              ? "border-[#E2484D]/70 ring-2 ring-[#E2484D]/10 shadow-sm"
              : "border-[#DDD6D1] hover:border-[#E2484D]/40 hover:shadow-sm",
          !value ? "text-[#B5A89F]" : "text-[#1B1615]",
        ].join(" ")}
      >
        <span className="truncate">
          {selected ? renderValue(selected) : placeholder}
        </span>
        <ChevronDown
          size={16} strokeWidth={2}
          className={[
            "shrink-0 transition-all duration-300",
            isOpen
              ? "rotate-180 text-[#E2484D]"
              : "text-[#9E8E85] group-hover:text-[#68625E]",
          ].join(" ")}
        />
      </button>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div
          className={[
            "absolute top-[calc(100%+6px)] left-0 right-0 z-50",
            "rounded-[14px] border border-[#EDE7E2] bg-white overflow-hidden",
            "shadow-[0_16px_48px_rgba(27,22,21,0.14)]",
            "transition-all duration-[180ms] origin-top",
            visible
              ? "opacity-100 scale-y-100 translate-y-0"
              : "opacity-0 scale-y-95 -translate-y-1",
          ].join(" ")}
        >
          <div className="max-h-[240px] overflow-y-auto py-1.5
            [&::-webkit-scrollbar]:w-[4px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#E7E0DB]
          ">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); close(); }}
                  className={[
                    "w-full flex items-center justify-between gap-3",
                    "px-4 py-[10px] text-[13px] text-left",
                    "transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "bg-[#FFF0F0] text-[#E2484D] font-semibold"
                      : "text-[#1B1615] hover:bg-[#FAF7F4] hover:pl-[22px]",
                  ].join(" ")}
                >
                  <span className="flex-1">{renderOption(option)}</span>
                  {isSelected && (
                    <Check size={14} strokeWidth={2.5} className="shrink-0 text-[#E2484D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── HomeSearch ────────────────────────────────────────────────────────────

export function DonorSearch() {
  const [bloodGroup,    setBloodGroup]    = useState("");
  const [area,          setArea]          = useState("");
  const [availability,  setAvailability]  = useState("all"); // default: All donors
  const [errors,        setErrors]        = useState<SearchErrors>({});
  const [isSearching,   setIsSearching]   = useState(false);

  const clearError = (key: keyof SearchErrors) =>
    setErrors((e) => ({ ...e, [key]: undefined }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearching) return;

    const newErrors: SearchErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = "Please select a blood group.";
    if (!area)       newErrors.area       = "Please select an area.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSearching(true);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      console.log({ bloodGroup, area, availability });
      // router.push(`/Find_A_Doner?bloodGroup=${bloodGroup}&area=${area}&availability=${availability}`);
    } finally {
      setIsSearching(false);
    }
  };

  // ── Blood group options ───────────────────────────────────────────────

  const bloodGroupOptions = BLOOD_GROUPS.map((g) => ({ value: g, label: g }));
  const areaOptions       = AREAS.map((a)          => ({ value: a, label: a }));

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="
        mx-auto w-full rounded-[18px]
        border border-[#E7E0DB] bg-white
        px-6 py-5 sm:px-8 sm:py-6
        shadow-[0_10px_30px_rgba(27,22,21,0.06)]
      ">
        <form onSubmit={onSubmit} className="w-full">

          {/* ── Header ── */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#FFE9E9] text-[#E2484D]">
              <Search size={18} strokeWidth={2} />
            </div>
            <h2 className="text-[16px] font-bold leading-none tracking-[-0.02em] text-[#1B1615] sm:text-[17px]">
              Find a blood donor
            </h2>
          </div>

          {/* ── Fields: 4-col on lg ── */}
          <div className="
            grid w-full grid-cols-1 gap-4
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_172px]
            lg:items-start
          ">

            {/* ── Blood Group ── */}
            <div className="min-w-0">
              <p className="mb-2 text-[13px] font-semibold text-[#403A37]">
                Blood Group
              </p>
              <CustomSelect
                value={bloodGroup}
                onChange={(v) => { setBloodGroup(v); clearError("bloodGroup"); }}
                options={bloodGroupOptions}
                placeholder="Select group"
                hasError={!!errors.bloodGroup}
                renderOption={({ label }) => (
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#E2484D]">
                      <Droplets size={13} strokeWidth={2} />
                    </span>
                    <span className="font-medium">{label}</span>
                  </span>
                )}
                renderValue={({ label }) => (
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#E2484D]">
                      <Droplets size={11} strokeWidth={2} />
                    </span>
                    {label}
                  </span>
                )}
              />
              <div className="h-5 pt-1">
                {errors.bloodGroup && (
                  <p className="text-[11px] font-medium text-[#E2484D]">⚠ {errors.bloodGroup}</p>
                )}
              </div>
            </div>

            {/* ── Area ── */}
            <div className="min-w-0">
              <p className="mb-2 text-[13px] font-semibold text-[#403A37]">
                Area
              </p>
              <CustomSelect
                value={area}
                onChange={(v) => { setArea(v); clearError("area"); }}
                options={areaOptions}
                placeholder="Select area"
                hasError={!!errors.area}
                renderOption={({ label }) => (
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0EDEA] text-[#9E8E85]">
                      <MapPin size={13} strokeWidth={2} />
                    </span>
                    <span className="font-medium">{label}</span>
                  </span>
                )}
                renderValue={({ label }) => (
                  <span className="flex items-center gap-2">
                    <MapPin size={13} strokeWidth={2} className="shrink-0 text-[#9E8E85]" />
                    {label}
                  </span>
                )}
              />
              <div className="h-5 pt-1">
                {errors.area && (
                  <p className="text-[11px] font-medium text-[#E2484D]">⚠ {errors.area}</p>
                )}
              </div>
            </div>

            {/* ── Availability ── */}
            <div className="min-w-0">
              <p className="mb-2 text-[13px] font-semibold text-[#403A37]">
                Availability
              </p>
              <CustomSelect
                value={availability}
                onChange={setAvailability}
                options={AVAILABILITY_OPTIONS}
                placeholder="All donors"
                renderOption={({ label, dot }) => (
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0EDEA] text-[#9E8E85]">
                      {dot
                        ? <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                        : <Clock size={12} strokeWidth={2} />
                      }
                    </span>
                    <span className="font-medium">{label}</span>
                  </span>
                )}
                renderValue={({ label, dot }) => (
                  <span className="flex items-center gap-2">
                    {dot
                      ? <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      : <Clock size={13} strokeWidth={2} className="shrink-0 text-[#9E8E85]" />
                    }
                    {label}
                  </span>
                )}
              />
              {/* fixed-height slot keeps layout from shifting */}
              <div className="h-5 pt-1" />
            </div>

            {/* ── Search Button ── */}
            <div className="w-full lg:pt-[29px]">
              <button
                type="submit"
                disabled={isSearching}
                className="
                  flex h-[48px] w-full items-center justify-center gap-2
                  rounded-[11px] border border-[#E2484D] bg-[#E2484D]
                  px-5 text-[14px] font-semibold text-white
                  shadow-[0_8px_20px_rgba(226,72,77,0.18)]
                  transition-all duration-300
                  hover:-translate-y-[1px] hover:bg-[#D83E43]
                  hover:shadow-[0_12px_28px_rgba(226,72,77,0.28)]
                  active:translate-y-0 active:scale-[0.99]
                  disabled:cursor-not-allowed disabled:opacity-70
                "
              >
                {isSearching ? (
                  <><Loader2 size={16} className="animate-spin" /><span>Searching…</span></>
                ) : (
                  <><Search size={16} strokeWidth={2.3} /><span>Search Donors</span></>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}