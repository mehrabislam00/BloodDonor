"use client";
import React, { useState } from "react";
import { User, Mail, Phone, MessageCircle, Pencil } from "lucide-react";
import { EditModal } from "./ui/EditModal";
import { SaveButton } from "./ui/SaveButton";
import { InfoRow } from "./ui/InfoRow";
import { INPUT_CLASS } from "./constants";
import type { UserData } from "./types";

type PersonalForm = Pick<UserData, "fullName"|"email"|"phone"|"whatsapp">;

interface Props {
  user: UserData;
  onSave: (data: PersonalForm) => void;
}

export function PersonalInfoCard({ user, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState<PersonalForm>({ fullName:user.fullName, email:user.email, phone:user.phone, whatsapp:user.whatsapp });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof PersonalForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleOpen = () => {
    setForm({ fullName:user.fullName, email:user.email, phone:user.phone, whatsapp:user.whatsapp });
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
          <h3 className="text-[15px] font-extrabold tracking-[-0.015em] text-[#1B1615]">Personal Information</h3>
          <button onClick={handleOpen}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-[#E2484D] transition-all hover:bg-[#FFF0F0]"
          >
            <Pencil size={11} strokeWidth={2.5} /> Edit
          </button>
        </div>
        <div className="divide-y divide-[#F5EFE9]">
          <InfoRow icon={User}          label="Full Name" value={user.fullName} />
          <InfoRow icon={Mail}          label="Email"     value={user.email}    />
          <InfoRow icon={Phone}         label="Phone"     value={user.phone}    />
          <InfoRow icon={MessageCircle} label="WhatsApp"  value={user.whatsapp} />
        </div>
      </div>

      {editing && (
        <EditModal
          title="Edit Personal Information"
          subtitle="Update your personal contact details"
          onClose={() => setEditing(false)}
          footer={<SaveButton saving={saving} success={success} onClick={handleSave} />}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">Full Name</label>
              <input type="text" value={form.fullName} onChange={set("fullName")} className={INPUT_CLASS} placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">Email</label>
              <input type="email" value={form.email} onChange={set("email")} className={INPUT_CLASS} placeholder="you@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">Phone</label>
                <input type="tel" value={form.phone} onChange={set("phone")} className={INPUT_CLASS} placeholder="01XXXXXXXXX" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#403A37]">
                  WhatsApp <span className="ml-1 text-[11px] font-normal text-[#B5A89F]">(optional)</span>
                </label>
                <input type="tel" value={form.whatsapp} onChange={set("whatsapp")} className={INPUT_CLASS} placeholder="01XXXXXXXXX" />
              </div>
            </div>
          </div>
        </EditModal>
      )}
    </>
  );
}