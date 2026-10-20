"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";
import AdminSelect from "@/components/admin/AdminSelect";
import { toast } from "@/components/toast/ui/toast";

type Donor = {
  id: string; name: string; email: string; phone: string; bloodGroup: string; area: string; address: string;
  availability: string; status: string; lastDonationDate: string; createdAt: string | null;
};

const empty: Donor[] = [];

export default function DonorsPage() {
  const [donors, setDonors] = useState(empty);
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");
  const [selected, setSelected] = useState<Donor | null>(null);
  const [editing, setEditing] = useState<Donor | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/data?resource=donors", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load donors.");
      setDonors((await response.json()).donors ?? []);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load donors.");
    } finally { setBusy(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const areas = useMemo(() => [...new Set(donors.map((d) => d.area).filter(Boolean))].sort(), [donors]);
  const filtered = donors.filter((d) =>
    (!search || `${d.name} ${d.email}`.toLowerCase().includes(search.toLowerCase())) &&
    (!blood || d.bloodGroup === blood) && (!area || d.area === area) &&
    (!status || d.status === status) && (!availability || d.availability === availability),
  );
  async function updateAvailability() {
    if (!editing) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/manage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-donor-availability", userId: editing.id, availability: editing.availability }),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Unable to update availability.");
      setEditing(null); toast.success({ title: "Availability updated", description: "The donor availability was saved." }); await load();
    } catch (error) { const text = error instanceof Error ? error.message : "Unable to update availability."; setMessage(text); toast.error({ title: "Availability update failed", description: text }); setBusy(false); }
  }
  async function banDonor(donor: Donor) {
    if (!window.confirm(`${donor.status === "Banned" ? "Unban" : "Ban"} ${donor.name}?`)) return;
    setBusy(true);
    try {
      const action = donor.status === "Banned" ? "unban-donor" : "ban-donor";
      const reason = action === "ban-donor" ? window.prompt("Enter the reason for this ban:")?.trim() ?? "" : "";
      if (action === "ban-donor" && !reason) { setBusy(false); return; }
      const response = await fetch("/api/admin/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, userId: donor.id, reason }) });
      if (!response.ok) throw new Error((await response.json()).error ?? "Unable to update account.");
      toast.success({ title: action === "ban-donor" ? "Donor banned" : "Donor unbanned", description: `${donor.name}'s account status was updated.` }); await load();
    } catch (error) { const text = error instanceof Error ? error.message : "Unable to update account."; setMessage(text); toast.error({ title: "Account update failed", description: text }); setBusy(false); }
  }
  return (
    <section>
      <Header title="Manage Donors" count={`${donors.length} total donors registered`} busy={busy} onRefresh={load} />
      {message && <p className="mb-4 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#B92F35]">{message}</p>}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total Donors" value={donors.length} /><Stat label="Active Donors" value={donors.filter((d) => d.status === "Active").length} />
        <Stat label="Available Now" value={donors.filter((d) => d.availability === "Available").length} /><Stat label="Banned Donors" value={donors.filter((d) => d.status === "Banned").length} />
      </div>
      <div className="rounded-[18px] border border-[#EDE7E2] bg-white">
        <div className="flex flex-wrap gap-3 border-b border-[#F5EFE9] p-5">
          <div className="flex h-[38px] min-w-[240px] flex-1 items-center gap-2 rounded-[9px] border border-[#E0D9D4] px-3"><Search size={14} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 outline-none" />{search && <button onClick={() => setSearch("")}><X size={12} /></button>}</div>
          <AdminSelect label="Blood Group" options={["A+","A-","B+","B-","AB+","AB-","O+","O-"]} value={blood} onChange={setBlood} /><AdminSelect label="Area" options={areas} value={area} onChange={setArea} /><AdminSelect label="Status" options={["Active","Banned"]} value={status} onChange={setStatus} /><AdminSelect label="Availability" options={["Available","Unavailable"]} value={availability} onChange={setAvailability} />
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead><tr className="border-b border-[#F5EFE9]">{["Donor","Blood","Area","Availability","Status","Last donation","Actions"].map((h) => <th key={h} className="px-5 py-3 text-xs uppercase text-[#B5A89F]">{h}</th>)}</tr></thead><tbody className="divide-y divide-[#F5EFE9]">
          {filtered.map((d) => <tr key={d.id}><td className="px-5 py-4"><b>{d.name}</b><p className="text-xs text-[#9E8E85]">{d.email}</p></td><td className="px-5 py-4">{d.bloodGroup || "—"}</td><td className="px-5 py-4">{d.area || "—"}</td><td className="px-5 py-4">{d.availability}</td><td className="px-5 py-4">{d.status}</td><td className="px-5 py-4">{d.lastDonationDate || "—"}</td><td className="px-5 py-4"><button className="mr-2 text-[#2563EB]" onClick={() => setSelected(d)}>View</button><button className="mr-2 text-[#68625E]" onClick={() => setEditing(d)}>Edit</button><button className="text-[#E2484D]" onClick={() => void banDonor(d)}>{d.status === "Banned" ? "Unban" : "Ban"}</button></td></tr>)}
          {!filtered.length && <tr><td colSpan={7} className="py-12 text-center text-[#9E8E85]">No donors match your filters.</td></tr>}
        </tbody></table></div>
      </div>
      {selected && <Modal title="Donor details" onClose={() => setSelected(null)}>
        <Detail label="Full name" value={selected.name} />
        <Detail label="Email" value={selected.email} />
        <Detail label="Phone" value={selected.phone} />
        <Detail label="Blood group" value={selected.bloodGroup} />
        <Detail label="Area" value={selected.area} />
        <Detail label="Address" value={selected.address} />
        <Detail label="Availability" value={selected.availability} />
        <Detail label="Account status" value={selected.status} />
        <Detail label="Last donation" value={selected.lastDonationDate} />
        <Detail label="Registered" value={selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""} />
        <button type="button" onClick={() => { setEditing(selected); setSelected(null); }} className="mt-3 rounded-lg bg-[#E2484D] px-4 py-2 text-white">Edit availability only</button>
      </Modal>}
      {editing && <Modal title="Edit availability" onClose={() => setEditing(null)}><AdminSelect label="Availability" options={["Available","Unavailable"]} value={editing.availability} onChange={(value) => setEditing({ ...editing, availability: value })} /><button disabled={busy} onClick={() => void updateAvailability()} className="mt-5 rounded-lg bg-[#E2484D] px-4 py-2 text-white disabled:opacity-50">Save changes</button></Modal>}
    </section>
  );
}

function Header({ title, count, busy, onRefresh }: { title: string; count: string; busy: boolean; onRefresh: () => void }) { return <div className="mb-6 flex flex-wrap justify-between gap-4"><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#E2484D]">Management</p><h1 className="text-[28px] font-extrabold">{title}</h1><p className="mt-1 text-sm text-[#9E8E85]">{count}</p></div><button onClick={onRefresh} disabled={busy} className="flex h-9 items-center gap-2 rounded-lg border border-[#E0D9D4] bg-white px-3.5 text-sm disabled:opacity-50"><RefreshCw size={14} className={busy ? "animate-spin" : ""} /> Refresh</button></div>; }
function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-[14px] border border-[#EDE7E2] bg-white p-5"><p className="text-xs uppercase text-[#9E8E85]">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div>; }
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1615]/25 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6"><div className="flex justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose}><X size={18} /></button></div><div className="mt-5 space-y-3 text-sm">{children}</div></div></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 border-b border-[#F5EFE9] pb-2"><span className="text-[#9E8E85]">{label}</span><span className="text-right font-semibold text-[#1B1615]">{value || "Not provided"}</span></div>; }
