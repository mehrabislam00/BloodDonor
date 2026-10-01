"use client";
import React, { useState } from "react";
import { Droplets, MapPin, Calendar, Clock, Pencil } from "lucide-react";
import { EditModal } from "./ui/EditModal";
import { SaveButton } from "./ui/SaveButton";
import { InfoRow } from "./ui/InfoRow";
import { MiniSelect } from "./ui/MiniSelect";
import { BLOOD_GROUPS, AREAS, AVAILABILITY_OPTIONS, INPUT_CLASS, formatDate } from "./constants";
import type { UserData } from "./types";

type DonationForm = Pick<UserData,"bloodGroup"|"area"|"lastDonationDate"|"availability">;

interface Props { user: UserData; onSave: (data: DonationForm) => void; }

export function DonationInfoCard({ user, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState<DonationForm>({ bloodGroup:user.bloodGroup, area:user.area, lastDonationDate:user.lastDonationDate, availability:user.availability });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setForm({ bloodGroup:user.bloodGroup, area:user.area, lastDonationDate:user.lastDonationDate, availability:user.availability });
    setSuccess(false);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSuccess(true);
    onSave(form);
    await new Promise(r => setTimeout(r, 600));
    setEditing(false);
  };

  return (
    <>
      <div className="rounded-[18px] border border-[#EDE7E2] bg-white p-6 shadow-[0_4px_20px_rgba(27,22,21,0.05)]">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold tracking-[-0.015em] text-[#1B1615]">Donation Information</h3>
          <button onClick={handleOpen}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-[#E2484D] transition-all hover:bg-[#FFF0F0]"
          >
            <Pencil size={11} strokeWidth={2.5} /> Edit
          </button>
        </div>
        <div className="divide-y divide-[#F5EFE9]">
          <InfoRow icon={Droplets} label="Blood Group"        value={user.bloodGroup}                   />
          <InfoRow icon={MapPin}   label="Area"               value={user.area}                         />
          <InfoRow icon={Calendar} label="Last Donation Date" value={formatDate(user.lastDonationDate)} />
          <InfoRow icon={Clock}    label="Availability"       value={user.availability}                 />
        </div>
      </div>

      {editing && (
        <EditModal
          title="Edit Donation Information"
          subtitle="Update your blood donation details"
          onClose={() => setEditing(false)}
          footer={<SaveButton saving={saving} success={success} onClick={handleSave} />}
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">Blood Group</label>
                <MiniSelect value={form.bloodGroup} onChange={v => setForm(f=>({...f,bloodGroup:v}))} options={BLOOD_GROUPS} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">Area</label>
                <MiniSelect value={form.area} onChange={v => setForm(f=>({...f,area:v}))} options={AREAS} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
                Last Donation Date <span className="ml-1 text-[11px] font-normal text-[#B5A89F]">(optional)</span>
              </label>
              <input type="date" value={form.lastDonationDate}
                onChange={e => setForm(f=>({...f,lastDonationDate:e.target.value}))}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">Availability</label>
              <MiniSelect value={form.availability} onChange={v => setForm(f=>({...f,availability:v}))} options={AVAILABILITY_OPTIONS} />
            </div>
          </div>
        </EditModal>
      )}
    </>
  );
}