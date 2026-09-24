
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import {
  Search,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";

type SearchErrors = {
  bloodGroup?: string;
  area?: string;
};

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const areas = [
  "Dhanmondi",
  "Mirpur",
  "Uttara",
  "Gulshan",
  "Mohammadpur",
  "Banani",
  "Motijheel",
  "Farmgate",
];

type CustomSelectProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
};

function CustomSelect({
  name,
  label,
  placeholder,
  value,
  options,
  error,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <label
        className="
          mb-2 block
          text-[14px]
          font-medium
          leading-none
          text-[#403A37]
        "
      >
        {label}
      </label>

      {/* Hidden input for FormData */}
      <input type="hidden" name={name} value={value} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex h-[48px] w-full
          items-center justify-between
          rounded-[11px]
          border
          bg-white
          px-4
          text-left
          text-[14px]
          shadow-sm
          outline-none
          transition-all duration-200
          ${
            error
              ? "border-[#E2484D] ring-2 ring-[#E2484D]/10"
              : isOpen
              ? "border-[#E2484D] ring-2 ring-[#E2484D]/10"
              : "border-[#DDD6D1] hover:border-[#E2484D]/40"
          }
        `}
      >
        <span
          className={
            value
              ? "text-[#403A37]"
              : "text-[#68625E]"
          }
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={17}
          strokeWidth={2}
          className={`
            shrink-0
            text-[#68625E]
            transition-transform duration-200
            ${isOpen ? "rotate-180 text-[#E2484D]" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[76px]
            z-50
            overflow-hidden
            rounded-[13px]
            border border-[#E7E0DB]
            bg-white
            p-1.5
            shadow-[0_14px_35px_rgba(27,22,21,0.13)]
            animate-in
            fade-in
            slide-in-from-top-1
            duration-150
          "
        >
          <div className="max-h-[240px] overflow-y-auto">
            {options.map((option) => {
              const selected = value === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`
                    flex w-full
                    items-center justify-between
                    rounded-[9px]
                    px-3
                    py-2.5
                    text-left
                    text-[14px]
                    transition-all duration-150
                    ${
                      selected
                        ? "bg-[#FFE9E9] font-medium text-[#E2484D]"
                        : "text-[#403A37] hover:bg-[#FFF3F3] hover:text-[#E2484D]"
                    }
                  `}
                >
                  <span>{option}</span>

                  {selected && (
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      className="text-[#E2484D]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      <div className="mt-1 min-h-[16px]">
        {error && (
          <p className="text-[11px] leading-[16px] text-[#E2484D]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function HomeSearch() {
  const [isSearching, setIsSearching] = useState(false);

  const [bloodGroup, setBloodGroup] = useState("");
  const [area, setArea] = useState("");

  const [errors, setErrors] = useState<SearchErrors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSearching) return;

    const newErrors: SearchErrors = {};

    if (!bloodGroup) {
      newErrors.bloodGroup =
        "Please select a blood group.";
    }

    if (!area) {
      newErrors.area =
        "Please select an area.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSearching(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1800)
      );

      console.log({
        bloodGroup,
        area,
      });

      // router.push(
      //   `/Find_A_Doner?bloodGroup=${bloodGroup}&area=${area}`
      // );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 " >
      <div
        className="
          mx-auto w-full
          rounded-[18px]
          border border-[#E7E0DB]
          bg-white
          px-5 py-5
          shadow-[0_30px_60px_rgba(27,22,21,0.14)]
          sm:px-7 sm:py-6
          
        "
      >
        <form onSubmit={onSubmit} className="w-full">
          {/* Header */}
          <div className="mb-5 flex items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-[11px]
                bg-[#FFE9E9]
                text-[#E2484D]
              "
            >
              <Search
                size={18}
                strokeWidth={2}
              />
            </div>

            <h2
              className="
                text-[16px]
                font-bold
                leading-none
                tracking-[-0.02em]
                text-[#1B1615]
                sm:text-[17px]
              "
            >
              Find a blood donor
            </h2>
          </div>

          {/* Fields */}
          <div
            className="
              grid w-full
              grid-cols-1
              gap-4
              lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_172px]
              lg:items-start
              lg:gap-4
            "
          >
            {/* Blood Group */}
            <CustomSelect
              name="bloodGroup"
              label="Blood Group"
              placeholder="Select group"
              value={bloodGroup}
              options={bloodGroups}
              error={errors.bloodGroup}
              onChange={(value) => {
                setBloodGroup(value);

                if (errors.bloodGroup) {
                  setErrors((prev) => ({
                    ...prev,
                    bloodGroup: undefined,
                  }));
                }
              }}
            />

            {/* Area */}
            <CustomSelect
              name="area"
              label="Area"
              placeholder="Select area"
              value={area}
              options={areas}
              error={errors.area}
              onChange={(value) => {
                setArea(value);

                if (errors.area) {
                  setErrors((prev) => ({
                    ...prev,
                    area: undefined,
                  }));
                }
              }}
            />

            {/* Search Button */}
            <div className="min-w-0 lg:pt-[22px]">
              <Button
                type="submit"
                isDisabled={isSearching}
                className="
                  h-[48px] w-full
                  rounded-[11px]
                  border border-[#E2484D]
                  bg-[#E2484D]
                  px-5
                  text-[14px]
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(226,72,77,0.18)]
                  transition-all duration-300
                  hover:-translate-y-[1px]
                  hover:bg-[#D83E43]
                  hover:shadow-[0_10px_25px_rgba(226,72,77,0.25)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-80
                "
              >
                {isSearching ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search
                      size={17}
                      strokeWidth={2.2}
                    />
                    Search Donors
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

