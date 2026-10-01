"use client";
import React, { useState, useRef } from "react";
import { User, Mail, Phone, MessageCircle, Droplets, MapPin, Calendar, Clock, Camera, ImagePlus, X } from "lucide-react";
import { EditModal } from "./ui/EditModal";
import { SaveButton } from "./ui/SaveButton";
import { MiniSelect } from "./ui/MiniSelect";
import { BLOOD_GROUPS, AREAS, AVAILABILITY_OPTIONS, INPUT_CLASS } from "./constants";
import type { UserData } from "./types";

interface Props { user: UserData; onClose: () => void; onSave: (u: UserData) => void; }

export function EditProfileModal({ user, onClose, onSave }: Props) {
  const [form,    setForm]    = useState({ ...user });
  const [preview, setPreview] = useState<string|null>(user.photoUrl);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof UserData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setPreview(url);
      setForm(f => ({ ...f, photoUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setForm(f => ({ ...f, photoUrl: null }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1400));
    setSaving(false);
    setSuccess(true);
    onSave(form);
    await new Promise(r => setTimeout(r, 600));
    onClose();
  };

  const lbl = (text: string, icon: React.ElementType, optional = false) => {
    const Icon = icon;
    return (
      <label className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[#403A37]">
        <Icon size={12} strokeWidth={2.5} className="text-[#9E8E85]" />
        {text}
        {optional && <span className="ml-1 text-[11px] font-normal text-[#B5A89F]">(optional)</span>}
      </label>
    );
  };

  return (
    <EditModal
      title="Edit Profile"
      subtitle="Update your complete donor profile"
      onClose={onClose}
      footer={<SaveButton saving={saving} success={success} onClick={handleSave} />}
    >
      <div className="flex flex-col gap-5">

        {/* Profile photo */}
        <div
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer items-center gap-4 rounded-[13px] border-[1.5px] border-dashed border-[#DDD6D1] bg-[#FDFAF8] p-4 transition-all hover:border-[#E2484D]/40 hover:bg-[#FFF5F5]"
        >
          {preview ? (
            <div className="relative shrink-0">
              <img src={preview} alt="Profile" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#E2484D]/20" />
              <button type="button" onClick={removePhoto}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E2484D] text-white shadow"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4]">
              <Camera size={22} strokeWidth={1.8} className="text-[#E2484D]/60" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <ImagePlus size={14} strokeWidth={2} className="text-[#E2484D]" />
              <p className="text-[13px] font-semibold text-[#1B1615]">
                {preview ? "Change photo" : "Upload profile photo"}
              </p>
            </div>
            <p className="mt-0.5 text-[11.5px] text-[#9E8E85]">Optional · JPG, PNG, WEBP · max 5 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        <div className="border-t border-[#F0EAE5]" />

        {/* Full Name */}
        <div>{lbl("Full Name", User)}<input type="text" value={form.fullName} onChange={set("fullName")} className={INPUT_CLASS} placeholder="Your full name" /></div>

        {/* Email */}
        <div>{lbl("Email", Mail)}<input type="email" value={form.email} onChange={set("email")} className={INPUT_CLASS} placeholder="you@example.com" /></div>

        {/* Phone + WhatsApp */}
        <div className="grid grid-cols-2 gap-3">
          <div>{lbl("Phone", Phone)}<input type="tel" value={form.phone} onChange={set("phone")} className={INPUT_CLASS} placeholder="01XXXXXXXXX" /></div>
          <div>{lbl("WhatsApp", MessageCircle, true)}<input type="tel" value={form.whatsapp} onChange={set("whatsapp")} className={INPUT_CLASS} placeholder="01XXXXXXXXX" /></div>
        </div>

        {/* Blood Group + Area */}
        <div className="grid grid-cols-2 gap-3">
          <div>{lbl("Blood Group", Droplets)}<MiniSelect value={form.bloodGroup} onChange={v=>setForm(f=>({...f,bloodGroup:v}))} options={BLOOD_GROUPS} /></div>
          <div>{lbl("Area", MapPin)}<MiniSelect value={form.area} onChange={v=>setForm(f=>({...f,area:v}))} options={AREAS} /></div>
        </div>

        {/* Last Donation */}
        <div>{lbl("Last Donation Date", Calendar, true)}<input type="date" value={form.lastDonationDate} onChange={set("lastDonationDate")} className={INPUT_CLASS} /></div>

        {/* Availability */}
        <div>{lbl("Availability", Clock)}<MiniSelect value={form.availability} onChange={v=>setForm(f=>({...f,availability:v}))} options={AVAILABILITY_OPTIONS} /></div>

      </div>
    </EditModal>
  );
}