"use client";
import React, { useState } from "react";
import { Search, RefreshCw, Download, ChevronDown, Eye, Pencil, Ban, Trash2, X, Check, MoreHorizontal } from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const DONORS = [
  { id:"1", name:"Rahim Hasan",   email:"rahim@example.com",   initials:"RH", blood:"O+",  area:"Mirpur",      avail:"Available",   status:"Active",   lastActive:"2 hrs ago",    registered:"01 Jan 2025", lastDonation:"2 months ago"  },
  { id:"2", name:"Nusrat Jahan",  email:"nusrat@example.com",  initials:"NJ", blood:"A+",  area:"Dhanmondi",   avail:"Available",   status:"Active",   lastActive:"18 min ago",   registered:"14 Feb 2025", lastDonation:"4 months ago"  },
  { id:"3", name:"Samiul Karim",  email:"samiul@example.com",  initials:"SK", blood:"B-",  area:"Uttara",      avail:"Available",   status:"Active",   lastActive:"Today",        registered:"05 Mar 2025", lastDonation:"5 months ago"  },
  { id:"4", name:"Farzana Akter", email:"farzana@example.com", initials:"FA", blood:"AB+", area:"Mohammadpur", avail:"Unavailable", status:"Active",   lastActive:"Yesterday",    registered:"20 Apr 2025", lastDonation:"3 months ago"  },
  { id:"5", name:"Tanvir Ahmed",  email:"tanvir@example.com",  initials:"TA", blood:"O-",  area:"Bashundhara", avail:"Available",   status:"Inactive", lastActive:"3 hrs ago",    registered:"10 May 2025", lastDonation:"6 months ago"  },
  { id:"6", name:"Maisha Rahman", email:"maisha@example.com",  initials:"MR", blood:"A-",  area:"Banani",      avail:"Available",   status:"Active",   lastActive:"5 hrs ago",    registered:"22 Jun 2025", lastDonation:"4 months ago"  },
  { id:"7", name:"Karim Uddin",   email:"karim@example.com",   initials:"KU", blood:"B+",  area:"Gulshan",     avail:"Unavailable", status:"Banned",   lastActive:"3 days ago",   registered:"08 Jul 2025", lastDonation:"7 months ago"  },
  { id:"8", name:"Sadia Islam",   email:"sadia@example.com",   initials:"SI", blood:"AB-", area:"Farmgate",    avail:"Available",   status:"Active",   lastActive:"30 min ago",   registered:"30 Aug 2025", lastDonation:"1 month ago"   },
];

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const AREAS        = ["Mirpur","Dhanmondi","Uttara","Gulshan","Mohammadpur","Banani","Motijheel","Farmgate","Bashundhara"];
const PAGE_SIZE    = 6;

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[14px] border border-[#EDE7E2] bg-white p-5">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#9E8E85]">{label}</p>
      <p className={`mt-1.5 text-[30px] font-extrabold tracking-[-0.03em] ${color}`}>{value}</p>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function Badge({ label, type }: { label: string; type: string }) {
  const map: Record<string, string> = {
    Available:   "bg-[#EDFAF3] text-[#1A9E56]",
    Unavailable: "bg-[#F5F0EC] text-[#68625E]",
    Active:      "bg-[#EFF6FF] text-[#2563EB]",
    Inactive:    "bg-[#F5F0EC] text-[#9E8E85]",
    Banned:      "bg-[#FFF5F5] text-[#E2484D]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-[4px] text-[11.5px] font-semibold ${map[label] ?? "bg-[#F5F0EC] text-[#68625E]"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

function Select({ label, options, value, onChange }: { label:string; options:string[]; value:string; onChange:(v:string)=>void }) {
  return (
    <div className="relative">
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="h-[38px] w-full appearance-none rounded-[9px] border border-[#E0D9D4] bg-white pl-3 pr-8 text-[13px] text-[#1B1615] outline-none transition-all hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10"
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} strokeWidth={2} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E8E85]" />
    </div>
  );
}

// ── Drawer ─────────────────────────────────────────────────────────────────────

function DonorDrawer({ donor, onClose }: { donor: typeof DONORS[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[420px] flex-col bg-white shadow-[-8px_0_40px_rgba(27,22,21,0.12)]">
        <div className="flex items-center justify-between border-b border-[#F0EAE5] px-6 py-5">
          <h3 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#1B1615]">Donor Details</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4]"><X size={15} strokeWidth={2} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[20px] font-extrabold text-[#E2484D] shadow-[0_0_0_4px_rgba(226,72,77,0.08)]">{donor.initials}</div>
            <div>
              <p className="text-[18px] font-extrabold text-[#1B1615]">{donor.name}</p>
              <p className="text-[13px] text-[#9E8E85]">{donor.email}</p>
              <div className="mt-1.5 flex gap-2">
                <Badge label={donor.status} type="status" />
                <Badge label={donor.avail}  type="avail"  />
              </div>
            </div>
          </div>
          {/* Info */}
          {[
            ["Blood Group",    donor.blood],
            ["Area",           donor.area],
            ["Last Active",    donor.lastActive],
            ["Last Donation",  donor.lastDonation],
            ["Registered",     donor.registered],
          ].map(([k,v]) => (
            <div key={k} className="flex items-center justify-between border-b border-[#F5EFE9] py-3.5">
              <span className="text-[13px] font-medium text-[#9E8E85]">{k}</span>
              <span className="text-[13.5px] font-semibold text-[#1B1615]">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 border-t border-[#F0EAE5] px-6 py-5">
          <button className="flex-1 rounded-[10px] border border-[#E0D9D4] py-2.5 text-[13px] font-semibold text-[#68625E] hover:bg-[#FAF7F4]">Edit</button>
          <button className="flex-1 rounded-[10px] bg-[#E2484D] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(226,72,77,0.22)] hover:bg-[#D83E43]">Ban Donor</button>
        </div>
      </div>
    </div>
  );
}

// ── Action menu ────────────────────────────────────────────────────────────────

function ActionMenu({ donor, onView }: { donor: typeof DONORS[0]; onView: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o=>!o)} className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-transparent text-[#9E8E85] hover:border-[#EDE7E2] hover:bg-[#FAF7F4] hover:text-[#1B1615] transition-all">
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-[160px] overflow-hidden rounded-[12px] border border-[#EDE7E2] bg-white shadow-[0_12px_40px_rgba(27,22,21,0.12)]">
          {[
            { icon:Eye,    label:"View details", action:() => { onView(); setOpen(false); }, red:false },
            { icon:Pencil, label:"Edit profile",  action:() => setOpen(false), red:false },
            { icon:Ban,    label:"Ban donor",     action:() => setOpen(false), red:true  },
            { icon:Trash2, label:"Delete",        action:() => setOpen(false), red:true  },
          ].map(({ icon:Icon, label, action, red }) => (
            <button key={label} onClick={action} className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] transition-all ${red ? "text-[#E2484D] hover:bg-[#FFF5F5]" : "text-[#68625E] hover:bg-[#FAF7F4] hover:text-[#1B1615]"}`}>
              <Icon size={13} strokeWidth={2} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function DonorsPage() {
  const [search,  setSearch]  = useState("");
  const [blood,   setBlood]   = useState("");
  const [area,    setArea]    = useState("");
  const [status,  setStatus]  = useState("");
  const [avail,   setAvail]   = useState("");
  const [page,    setPage]    = useState(1);
  const [drawer,  setDrawer]  = useState<typeof DONORS[0] | null>(null);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalDonors     = DONORS.length;
  const activeDonors    = DONORS.filter(d => d.status === "Active").length;
  const availableDonors = DONORS.filter(d => d.avail  === "Available").length;
  const bannedDonors    = DONORS.filter(d => d.status === "Banned").length;

  const filtered = DONORS.filter(d =>
    (!search  || d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())) &&
    (!blood   || d.blood  === blood)  &&
    (!area    || d.area   === area)   &&
    (!status  || d.status === status) &&
    (!avail   || d.avail  === avail)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const hasFilters = !!(search || blood || area || status || avail);

  const clearFilters = () => { setSearch(""); setBlood(""); setArea(""); setStatus(""); setAvail(""); setPage(1); };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E2484D]">Management</p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#1B1615]">Manage Donors</h1>
          <p className="mt-1 text-[13.5px] text-[#9E8E85]">{DONORS.length} total donors registered</p>
        </div>
        <div className="flex gap-2">
          <button className="flex h-9 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3.5 text-[13px] font-medium text-[#68625E] hover:bg-[#FAF7F4] transition-all">
            <Download size={14} strokeWidth={2} /> Export
          </button>
          <button className="flex h-9 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3.5 text-[13px] font-medium text-[#68625E] hover:bg-[#FAF7F4] transition-all">
            <RefreshCw size={14} strokeWidth={2} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Donors"     value={totalDonors}     color="text-[#1B1615]" />
        <StatCard label="Active Donors"    value={activeDonors}    color="text-[#2563EB]" />
        <StatCard label="Available Now"    value={availableDonors} color="text-[#1A9E56]" />
        <StatCard label="Banned Donors"    value={bannedDonors}    color="text-[#E2484D]" />
      </div>

      {/* Table card */}
      <div className="rounded-[18px] border border-[#EDE7E2] bg-white">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#F5EFE9] p-5">
          {/* Search */}
          <div className="relative flex h-[38px] min-w-[240px] flex-1 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3 transition-all focus-within:border-[#E2484D]/60 focus-within:ring-2 focus-within:ring-[#E2484D]/10">
            <Search size={14} strokeWidth={2} className="shrink-0 text-[#C5B8B0]" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..."
              className="flex-1 bg-transparent text-[13px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none"
            />
            {search && <button onClick={() => setSearch("")}><X size={12} strokeWidth={2} className="text-[#B5A89F]" /></button>}
          </div>
          <Select label="Blood Group"  options={BLOOD_GROUPS}                       value={blood}  onChange={v=>{setBlood(v);setPage(1)}}  />
          <Select label="Area"         options={AREAS}                              value={area}   onChange={v=>{setArea(v);setPage(1)}}   />
          <Select label="Status"       options={["Active","Inactive","Banned"]}     value={status} onChange={v=>{setStatus(v);setPage(1)}} />
          <Select label="Availability" options={["Available","Unavailable"]}        value={avail}  onChange={v=>{setAvail(v);setPage(1)}}  />
          {hasFilters && (
            <button onClick={clearFilters} className="flex h-[38px] items-center gap-1.5 rounded-[9px] border border-[#E0D9D4] px-3.5 text-[13px] font-medium text-[#68625E] hover:bg-[#FAF7F4] transition-all">
              <X size={13} strokeWidth={2} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#F5EFE9]">
                {["Donor","Blood","Area","Availability","Status","Last Active","Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#B5A89F]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE9]">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-[13.5px] text-[#9E8E85]">No donors match your filters.</td></tr>
              ) : paged.map(d => (
                <tr key={d.id} className="group hover:bg-[#FAF7F4] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[11.5px] font-extrabold text-[#E2484D]">{d.initials}</div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#1B1615]">{d.name}</p>
                        <p className="text-[11.5px] text-[#9E8E85]">{d.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="rounded-full bg-[#FFE4E4] px-2.5 py-0.5 text-[11.5px] font-bold text-[#E2484D]">{d.blood}</span></td>
                  <td className="px-5 py-4 text-[13.5px] text-[#1B1615]">{d.area}</td>
                  <td className="px-5 py-4"><Badge label={d.avail} type="avail" /></td>
                  <td className="px-5 py-4"><Badge label={d.status} type="status" /></td>
                  <td className="px-5 py-4 text-[13px] text-[#9E8E85]">{d.lastActive}</td>
                  <td className="px-5 py-4">
                    <ActionMenu donor={d} onView={() => setDrawer(d)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#F5EFE9] px-5 py-4">
            <p className="text-[12.5px] text-[#9E8E85]">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[13px] text-[#68625E] disabled:opacity-40 hover:bg-[#FAF7F4] transition-all">‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`flex h-8 w-8 items-center justify-center rounded-[8px] text-[13px] font-semibold transition-all ${n===page ? "bg-[#E2484D] text-white shadow-[0_3px_10px_rgba(226,72,77,0.28)]" : "border border-[#EDE7E2] text-[#68625E] hover:bg-[#FAF7F4]"}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[13px] text-[#68625E] disabled:opacity-40 hover:bg-[#FAF7F4] transition-all">›</button>
            </div>
          </div>
        )}
      </div>

      {drawer && <DonorDrawer donor={drawer} onClose={() => setDrawer(null)} />}
    </>
  );
}