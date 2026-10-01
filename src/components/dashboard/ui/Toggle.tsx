"use client";
interface ToggleProps { on: boolean; onChange: () => void; disabled?: boolean; }

export function Toggle({ on, onChange, disabled = false }: ToggleProps) {
  return (
    <button type="button" onClick={onChange} role="switch" aria-checked={on} disabled={disabled}
      className={`relative inline-flex h-[26px] w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${on?"bg-[#E2484D]":"bg-[#DDD6D1]"}`}
    >
      <span className={`pointer-events-none inline-block h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform duration-300 ${on?"translate-x-[22px]":"translate-x-0"}`} />
    </button>
  );
}