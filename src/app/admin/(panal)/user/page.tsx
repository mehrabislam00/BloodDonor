"use client";
import React, { useState } from "react";
import {
  Search, RefreshCw, Download, ChevronDown,
  Eye, Ban, Trash2, X, MoreHorizontal, UserCheck, UserX, ShieldOff,
} from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const INITIAL_USERS = [
  { id: "1",  name: "Arif Rahman",    email: "arif@example.com",    initials: "AR", status: "Active",   hasDonorProfile: true,  lastActive: "10 min ago",  registered: "01 Jan 2025", registeredRaw: 20250101 },
  { id: "2",  name: "Tasnim Hoque",   email: "tasnim@example.com",  initials: "TH", status: "Active",   hasDonorProfile: false, lastActive: "2 hrs ago",   registered: "14 Feb 2025", registeredRaw: 20250214 },
  { id: "3",  name: "Imran Siddiqui", email: "imran@example.com",   initials: "IS", status: "Active",   hasDonorProfile: true,  lastActive: "Yesterday",   registered: "05 Mar 2025", registeredRaw: 20250305 },
  { id: "4",  name: "Nadia Alam",     email: "nadia@example.com",   initials: "NA", status: "Banned",   hasDonorProfile: false, lastActive: "3 days ago",  registered: "20 Apr 2025", registeredRaw: 20250420 },
  { id: "5",  name: "Sabbir Hasan",   email: "sabbir@example.com",  initials: "SH", status: "Active",   hasDonorProfile: true,  lastActive: "30 min ago",  registered: "10 May 2025", registeredRaw: 20250510 },
  { id: "6",  name: "Roksana Begum",  email: "roksana@example.com", initials: "RB", status: "Active",   hasDonorProfile: false, lastActive: "5 hrs ago",   registered: "22 Jun 2025", registeredRaw: 20250622 },
  { id: "7",  name: "Mehedi Hasan",   email: "mehedi@example.com",  initials: "MH", status: "Banned",   hasDonorProfile: true,  lastActive: "1 week ago",  registered: "08 Jul 2025", registeredRaw: 20250708 },
  { id: "8",  name: "Farida Islam",   email: "farida@example.com",  initials: "FI", status: "Active",   hasDonorProfile: false, lastActive: "Just now",    registered: "30 Aug 2025", registeredRaw: 20250830 },
  { id: "9",  name: "Shakil Ahmed",   email: "shakil@example.com",  initials: "SA", status: "Active",   hasDonorProfile: true,  lastActive: "4 hrs ago",   registered: "12 Sep 2025", registeredRaw: 20250912 },
  { id: "10", name: "Priya Chowdhury",email: "priya@example.com",   initials: "PC", status: "Active",   hasDonorProfile: false, lastActive: "3 hrs ago",   registered: "25 Oct 2025", registeredRaw: 20251025 },
];

const PAGE_SIZE = 6;

type User = typeof INITIAL_USERS[0];
type DialogType = "ban" | "unban" | "delete" | null;

// ── Helpers ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-[#EFF6FF] text-[#2563EB]",
    Banned: "bg-[#FFF5F5] text-[#E2484D]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-[4px] text-[11.5px] font-semibold ${map[status] ?? "bg-[#F5F0EC] text-[#68625E]"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

function DonorBadge({ has }: { has: boolean }) {
  return has ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EDFAF3] px-2.5 py-[4px] text-[11.5px] font-semibold text-[#1A9E56]">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      Donor
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0EC] px-2.5 py-[4px] text-[11.5px] font-semibold text-[#9E8E85]">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      None
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[14px] border border-[#EDE7E2] bg-white p-5">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#9E8E85]">{label}</p>
      <p className={`mt-1.5 text-[30px] font-extrabold tracking-[-0.03em] ${color}`}>{value}</p>
    </div>
  );
}

function Select({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-[38px] w-full appearance-none rounded-[9px] border border-[#E0D9D4] bg-white pl-3 pr-8 text-[13px] text-[#1B1615] outline-none transition-all hover:border-[#E2484D]/30 focus:border-[#E2484D]/60 focus:ring-2 focus:ring-[#E2484D]/10"
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} strokeWidth={2} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E8E85]" />
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-[12px] border border-[#E0D9D4] bg-white px-4 py-3 shadow-[0_12px_40px_rgba(27,22,21,0.14)]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EDFAF3] text-[#1A9E56]">✓</span>
      <span className="text-[13.5px] font-medium text-[#1B1615]">{message}</span>
    </div>
  );
}

// ── Confirmation Dialog ────────────────────────────────────────────────────────

function ConfirmDialog({
  type, user, onConfirm, onCancel,
}: {
  type: DialogType; user: User; onConfirm: () => void; onCancel: () => void;
}) {
  if (!type) return null;

  const config = {
    ban:    { title: "Ban this user?",    body: `${user.name}'s account will be marked as Banned. They won't be able to log in or access the platform.`,             btn: "Ban User",    btnClass: "bg-[#E2484D] text-white shadow-[0_4px_16px_rgba(226,72,77,0.22)] hover:bg-[#D83E43]" },
    unban:  { title: "Unban this user?",  body: `${user.name}'s account will be restored to Active. They will regain full access to the platform.`,                   btn: "Unban User",  btnClass: "bg-[#1A9E56] text-white shadow-[0_4px_16px_rgba(26,158,86,0.22)] hover:bg-[#158045]" },
    delete: { title: "Delete this user?", body: `This will permanently remove ${user.name}'s account. This is different from banning — the account cannot be recovered.`, btn: "Delete",   btnClass: "bg-[#E2484D] text-white shadow-[0_4px_16px_rgba(226,72,77,0.22)] hover:bg-[#D83E43]" },
  }[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#1B1615]/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-[400px] rounded-[18px] border border-[#EDE7E2] bg-white p-6 shadow-[0_20px_60px_rgba(27,22,21,0.18)]">
        <h3 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#1B1615]">{config.title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#9E8E85]">{config.body}</p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-[10px] border border-[#E0D9D4] py-2.5 text-[13px] font-semibold text-[#68625E] hover:bg-[#FAF7F4]">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold ${config.btnClass}`}>
            {config.btn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Drawer ─────────────────────────────────────────────────────────────────────

function UserDrawer({
  user, onClose, onAction,
}: {
  user: User; onClose: () => void; onAction: (t: DialogType) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[420px] flex-col bg-white shadow-[-8px_0_40px_rgba(27,22,21,0.12)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0EAE5] px-6 py-5">
          <h3 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#1B1615]">User Details</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4]">
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[20px] font-extrabold text-[#E2484D] shadow-[0_0_0_4px_rgba(226,72,77,0.08)]">
              {user.initials}
            </div>
            <div>
              <p className="text-[18px] font-extrabold text-[#1B1615]">{user.name}</p>
              <p className="text-[13px] text-[#9E8E85]">{user.email}</p>
              <div className="mt-1.5 flex gap-2">
                <StatusBadge status={user.status} />
                <DonorBadge has={user.hasDonorProfile} />
              </div>
            </div>
          </div>

          {/* Info rows */}
          {[
            ["Account Status",  user.status],
            ["Last Active",     user.lastActive],
            ["Registered",      user.registered],
            ["Donor Profile",   user.hasDonorProfile ? "Yes — active donor" : "Not registered"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-[#F5EFE9] py-3.5">
              <span className="text-[13px] font-medium text-[#9E8E85]">{k}</span>
              <span className="text-[13.5px] font-semibold text-[#1B1615]">{v}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-[#F0EAE5] px-6 py-5">
          {user.status === "Active" ? (
            <button
              onClick={() => onAction("ban")}
              className="flex-1 rounded-[10px] bg-[#E2484D] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(226,72,77,0.22)] hover:bg-[#D83E43]"
            >
              Ban User
            </button>
          ) : (
            <button
              onClick={() => onAction("unban")}
              className="flex-1 rounded-[10px] bg-[#1A9E56] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(26,158,86,0.22)] hover:bg-[#158045]"
            >
              Unban User
            </button>
          )}
          <button
            onClick={() => onAction("delete")}
            className="flex-1 rounded-[10px] border border-[#E0D9D4] py-2.5 text-[13px] font-semibold text-[#E2484D] hover:bg-[#FFF5F5]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Action menu ────────────────────────────────────────────────────────────────

function ActionMenu({
  user, onView, onAction,
}: {
  user: User; onView: () => void; onAction: (t: DialogType) => void;
}) {
  const [open, setOpen] = useState(false);
  const isBanned = user.status === "Banned";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-transparent text-[#9E8E85] transition-all hover:border-[#EDE7E2] hover:bg-[#FAF7F4] hover:text-[#1B1615]"
      >
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-[170px] overflow-hidden rounded-[12px] border border-[#EDE7E2] bg-white shadow-[0_12px_40px_rgba(27,22,21,0.12)]">
          {[
            { icon: Eye,      label: "View details",  action: () => { onView(); setOpen(false); },             red: false },
            isBanned
              ? { icon: UserCheck, label: "Unban user", action: () => { onAction("unban"); setOpen(false); },   red: false }
              : { icon: Ban,       label: "Ban user",   action: () => { onAction("ban"); setOpen(false); },     red: true  },
            { icon: Trash2,   label: "Delete user",   action: () => { onAction("delete"); setOpen(false); },   red: true  },
          ].map(({ icon: Icon, label, action, red }) => (
            <button
              key={label}
              onClick={action}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] transition-all ${red ? "text-[#E2484D] hover:bg-[#FFF5F5]" : "text-[#68625E] hover:bg-[#FAF7F4] hover:text-[#1B1615]"}`}
            >
              <Icon size={13} strokeWidth={2} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers]       = useState(INITIAL_USERS);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("");
  const [dateRange, setDateRange] = useState("");
  const [sort, setSort]         = useState("");
  const [page, setPage]         = useState(1);
  const [drawer, setDrawer]     = useState<User | null>(null);
  const [dialog, setDialog]     = useState<{ type: DialogType; user: User } | null>(null);
  const [toast, setToast]       = useState<string | null>(null);

  // Derived stats
  const total   = users.length;
  const active  = users.filter(u => u.status === "Active").length;
  const banned  = users.filter(u => u.status === "Banned").length;
  const recent  = users.filter(u => u.registeredRaw >= 20250801).length;

  // Filter
  const now = 20261020; // today
  let filtered = users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!status || u.status === status) &&
    (!dateRange ||
      (dateRange === "Last 7 Days"  && now - u.registeredRaw <=    7) ||
      (dateRange === "Last 30 Days" && now - u.registeredRaw <=   30))
  );

  // Sort
  if (sort === "Newest First")  filtered = [...filtered].sort((a, b) => b.registeredRaw - a.registeredRaw);
  if (sort === "Oldest First")  filtered = [...filtered].sort((a, b) => a.registeredRaw - b.registeredRaw);
  if (sort === "Name A–Z")      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!(search || status || dateRange || sort);

  const clearFilters = () => { setSearch(""); setStatus(""); setDateRange(""); setSort(""); setPage(1); };

  const commitAction = () => {
    if (!dialog) return;
    const { type, user } = dialog;
    if (type === "ban")    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "Banned" }  : u));
    if (type === "unban")  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "Active" }  : u));
    if (type === "delete") setUsers(prev => prev.filter(u => u.id !== user.id));
    setToast(type === "ban" ? `${user.name} has been banned.` : type === "unban" ? `${user.name} has been unbanned.` : `${user.name}'s account deleted.`);
    setDrawer(null);
    setDialog(null);
  };

  const openAction = (type: DialogType, user: User) => setDialog({ type, user });

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E2484D]">Management</p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#1B1615]">Manage Users</h1>
          <p className="mt-1 text-[13.5px] text-[#9E8E85]">View and manage registered users across the BloodDonor platform.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex h-9 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3.5 text-[13px] font-medium text-[#68625E] transition-all hover:bg-[#FAF7F4]">
            <Download size={14} strokeWidth={2} /> Export
          </button>
          <button className="flex h-9 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3.5 text-[13px] font-medium text-[#68625E] transition-all hover:bg-[#FAF7F4]">
            <RefreshCw size={14} strokeWidth={2} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users"          value={total}  color="text-[#1B1615]" />
        <StatCard label="Active Users"         value={active} color="text-[#2563EB]" />
        <StatCard label="Banned Users"         value={banned} color="text-[#E2484D]" />
        <StatCard label="Recently Registered"  value={recent} color="text-[#1A9E56]" />
      </div>

      {/* Table card */}
      <div className="rounded-[18px] border border-[#EDE7E2] bg-white">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#F5EFE9] p-5">
          {/* Search */}
          <div className="relative flex h-[38px] min-w-[240px] flex-1 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3 transition-all focus-within:border-[#E2484D]/60 focus-within:ring-2 focus-within:ring-[#E2484D]/10">
            <Search size={14} strokeWidth={2} className="shrink-0 text-[#C5B8B0]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="flex-1 bg-transparent text-[13px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none"
            />
            {search && <button onClick={() => setSearch("")}><X size={12} strokeWidth={2} className="text-[#B5A89F]" /></button>}
          </div>
          <Select label="Account Status" options={["Active", "Banned"]}                          value={status}    onChange={v => { setStatus(v);    setPage(1); }} />
          <Select label="Date Range"     options={["Last 7 Days", "Last 30 Days", "All Time"]}   value={dateRange} onChange={v => { setDateRange(v === "All Time" ? "" : v); setPage(1); }} />
          <Select label="Sort By"        options={["Newest First", "Oldest First", "Name A–Z"]}  value={sort}      onChange={v => { setSort(v);      setPage(1); }} />
          {hasFilters && (
            <button onClick={clearFilters} className="flex h-[38px] items-center gap-1.5 rounded-[9px] border border-[#E0D9D4] px-3.5 text-[13px] font-medium text-[#68625E] transition-all hover:bg-[#FAF7F4]">
              <X size={13} strokeWidth={2} /> Clear
            </button>
          )}
          <p className="ml-auto text-[12.5px] text-[#9E8E85]">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#F5EFE9]">
                {["User", "Account Status", "Registered", "Last Active", "Donor Profile", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#B5A89F]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE9]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <p className="text-[13.5px] text-[#9E8E85]">No users match your filters.</p>
                    {hasFilters && (
                      <button onClick={clearFilters} className="mt-2 text-[13px] font-medium text-[#E2484D] hover:underline">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : paged.map(u => (
                <tr key={u.id} className="group transition-colors hover:bg-[#FAF7F4]">
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[11.5px] font-extrabold text-[#E2484D]">
                        {u.initials}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#1B1615]">{u.name}</p>
                        <p className="text-[11.5px] text-[#9E8E85]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                  {/* Registered */}
                  <td className="px-5 py-4 text-[13.5px] text-[#1B1615]">{u.registered}</td>
                  {/* Last active */}
                  <td className="px-5 py-4 text-[13px] text-[#9E8E85]">{u.lastActive}</td>
                  {/* Donor profile */}
                  <td className="px-5 py-4"><DonorBadge has={u.hasDonorProfile} /></td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <ActionMenu
                      user={u}
                      onView={() => setDrawer(u)}
                      onAction={(t) => openAction(t, u)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#F5EFE9] px-5 py-4">
            <p className="text-[12.5px] text-[#9E8E85]">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[13px] text-[#68625E] transition-all hover:bg-[#FAF7F4] disabled:opacity-40"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-[8px] text-[13px] font-semibold transition-all ${n === page ? "bg-[#E2484D] text-white shadow-[0_3px_10px_rgba(226,72,77,0.28)]" : "border border-[#EDE7E2] text-[#68625E] hover:bg-[#FAF7F4]"}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#EDE7E2] text-[13px] text-[#68625E] transition-all hover:bg-[#FAF7F4] disabled:opacity-40"
              >›</button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawer && (
        <UserDrawer
          user={users.find(u => u.id === drawer.id) ?? drawer}
          onClose={() => setDrawer(null)}
          onAction={(t) => { openAction(t, drawer); }}
        />
      )}

      {/* Confirmation dialog */}
      {dialog && (
        <ConfirmDialog
          type={dialog.type}
          user={dialog.user}
          onConfirm={commitAction}
          onCancel={() => setDialog(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}