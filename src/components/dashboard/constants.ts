import type { UserData } from "./types";

export const AVAILABILITY_OPTIONS = [
  "Available Now",
  "Available in 1 Month",
  "Available in 2 Months",
  "Available in 3 Months",
  "Unavailable",
];

export type AvConfigItem = {
  dot: string; badge: string; badgeBg: string;
  label: string; labelColor: string;
};

export const AV_CONFIG: Record<string, AvConfigItem> = {
  "Available Now":         { dot:"bg-[#1A9E56]", badge:"text-[#1A9E56]", badgeBg:"bg-[#EDFAF3]", label:"AVAILABLE",       labelColor:"text-[#1B1615]" },
  "Available in 1 Month":  { dot:"bg-[#F59E0B]", badge:"text-[#B45309]", badgeBg:"bg-[#FFFBEB]", label:"AVAILABLE SOON",  labelColor:"text-[#1B1615]" },
  "Available in 2 Months": { dot:"bg-[#F59E0B]", badge:"text-[#B45309]", badgeBg:"bg-[#FFFBEB]", label:"AVAILABLE SOON",  labelColor:"text-[#1B1615]" },
  "Available in 3 Months": { dot:"bg-[#F97316]", badge:"text-[#C2410C]", badgeBg:"bg-[#FFF7ED]", label:"AVAILABLE LATER", labelColor:"text-[#1B1615]" },
  "Unavailable":           { dot:"bg-[#9E8E85]", badge:"text-[#68625E]", badgeBg:"bg-[#F5F0EC]", label:"UNAVAILABLE",     labelColor:"text-[#9E8E85]" },
};

export const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
export const AREAS        = ["Dhanmondi","Mirpur","Uttara","Gulshan","Mohammadpur","Banani","Motijheel","Farmgate"];

export const MOCK_USER: UserData = {
  fullName:"Rahim Hasan", email:"rahim@example.com",
  phone:"01712345678",    whatsapp:"01712345678",
  bloodGroup:"O+",        area:"Mirpur",
  lastDonationDate:"2025-07-12",
  availability:"Available Now",
  contactEnabled:true,    photoUrl:null,
};

export function getGreeting(name: string) {
  const h = new Date().getHours();
  const p = h>=5&&h<12?"morning":h>=12&&h<17?"afternoon":h>=17&&h<21?"evening":"night";
  return `Good ${p}, ${name}.`;
}

export function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
}

export function getInitials(name: string) {
  return name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
}

export const INPUT_CLASS = [
  "w-full h-[44px] rounded-[10px] border border-[#E0D9D4] bg-white px-4",
  "text-[13.5px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none",
  "transition-all duration-200 hover:border-[#E2484D]/30",
  "focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10 focus:bg-white",
].join(" ");