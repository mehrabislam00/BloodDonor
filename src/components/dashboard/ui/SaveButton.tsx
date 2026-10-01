import React from "react";
import { Loader2, Check } from "lucide-react";

interface Props { saving:boolean; success:boolean; onClick:()=>void; label?:string; }

export function SaveButton({ saving, success, onClick, label="Save Changes" }: Props) {
  return (
    <button type="button" onClick={onClick} disabled={saving}
      className="flex h-[44px] items-center gap-2 rounded-[10px] bg-[#E2484D] px-6 text-[13.5px] font-semibold text-white shadow-[0_6px_20px_rgba(226,72,77,0.22)] transition-all hover:bg-[#D83E43] disabled:opacity-70"
    >
      {saving  ? <><Loader2 size={14} className="animate-spin"/>Saving…</>  :
       success  ? <><Check size={14} strokeWidth={2.5}/>Saved!</>           :
                  <><Check size={14} strokeWidth={2.5}/>{label}</>}
    </button>
  );
}