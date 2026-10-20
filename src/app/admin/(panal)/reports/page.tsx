"use client";
import React, { useState } from "react";
import { Search, Flag, Clock, CheckCircle, X, Eye, Check, ChevronDown } from "lucide-react";

const REPORTS = [
  { id:"RPT-001", donor:"Farzana Akter",  reporter:"Community member", reason:"Donor unavailable",     date:"21 Sep 2026", status:"Pending"  },
  { id:"RPT-002", donor:"Samiul Karim",   reporter:"Community member", reason:"Invalid phone number",  date:"19 Sep 2026", status:"Reviewed" },
  { id:"RPT-003", donor:"Rahim Hasan",    reporter:"Community member", reason:"Fake information",      date:"14 Sep 2026", status:"Resolved" },
  { id:"RPT-004", donor:"Tanvir Ahmed",   reporter:"Community member", reason:"Inappropriate behavior", date:"10 Sep 2026", status:"Pending"  },
  { id:"RPT-005", donor:"Karim Uddin",    reporter:"Community member", reason:"Misleading information", date:"05 Sep 2026", status:"Dismissed"},
];

const STATUS_MAP: Record<string, string> = {
  Pending:   "bg-[#FFFBEB] text-[#B45309]",
  Reviewed:  "bg-[#EFF6FF] text-[#2563EB]",
  Resolved:  "bg-[#EDFAF3] text-[#1A9E56]",
  Dismissed: "bg-[#F5F0EC] text-[#9E8E85]",
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${STATUS_MAP[status] ?? ""}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{status}</span>;
}

function ReportDrawer({ report, onClose, onStatusChange }: { report: typeof REPORTS[0]; onClose: () => void; onStatusChange: (id: string, s: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#1B1615]/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[420px] flex-col bg-white shadow-[-8px_0_40px_rgba(27,22,21,0.12)]">
        <div className="flex items-center justify-between border-b border-[#F0EAE5] px-6 py-5">
          <div>
            <h3 className="text-[17px] font-extrabold text-[#1B1615]">Report {report.id}</h3>
            <p className="text-[12px] text-[#9E8E85]">Submitted {report.date}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7E2] text-[#9E8E85] hover:bg-[#FAF7F4]"><X size={15} strokeWidth={2} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="rounded-[12px] bg-[#FAF7F4] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#C5B8B0]">Current Status</p>
            <div className="mt-2"><StatusBadge status={report.status} /></div>
          </div>
          {[["Reported Donor", report.donor], ["Reporter", report.reporter], ["Report Reason", report.reason], ["Submitted", report.date]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-[#F5EFE9] pb-3.5">
              <span className="text-[13px] font-medium text-[#9E8E85]">{k}</span>
              <span className="text-[13.5px] font-semibold text-[#1B1615]">{v}</span>
            </div>
          ))}
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#C5B8B0]">Description</p>
            <p className="rounded-[10px] bg-[#FAF7F4] p-4 text-[13.5px] leading-relaxed text-[#68625E]">
              The donor has not responded to multiple contact attempts and their listed availability appears incorrect.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 border-t border-[#F0EAE5] px-6 py-5">
          {["Reviewed","Resolved","Dismissed"].map(s => (
            <button key={s} onClick={() => { onStatusChange(report.id, s); onClose(); }}
              className={`flex-1 rounded-[10px] py-2.5 text-[12.5px] font-semibold transition-all ${s==="Resolved" ? "bg-[#E2484D] text-white shadow-[0_4px_16px_rgba(226,72,77,0.22)] hover:bg-[#D83E43]" : "border border-[#E0D9D4] text-[#68625E] hover:bg-[#FAF7F4]"}`}
            >{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("");
  const [drawer,   setDrawer]   = useState<typeof REPORTS[0] | null>(null);
  const [reports,  setReports]  = useState(REPORTS);

  const filtered = reports.filter(r =>
    (!search || r.donor.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())) &&
    (!status || r.status === status)
  );

  const changeStatus = (id: string, s: string) => setReports(rs => rs.map(r => r.id === id ? {...r, status:s} : r));

  const counts = {
    total:    reports.length,
    pending:  reports.filter(r=>r.status==="Pending").length,
    reviewed: reports.filter(r=>r.status==="Reviewed").length,
    resolved: reports.filter(r=>r.status==="Resolved").length,
  };

  return (
    <>
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E2484D]">Management</p>
        <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#1B1615]">Community Reports</h1>
        <p className="mt-1 text-[13.5px] text-[#9E8E85]">Review and resolve donor reports submitted by users.</p>
      </div>

      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label:"Total Reports",   value:counts.total,    icon:Flag,         iconBg:"bg-[#F5F0EC]", iconCl:"text-[#9E8E85]"  },
          { label:"Pending Review",  value:counts.pending,  icon:Clock,        iconBg:"bg-[#FFFBEB]", iconCl:"text-[#D97706]"  },
          { label:"Under Review",    value:counts.reviewed, icon:Eye,          iconBg:"bg-[#EFF6FF]", iconCl:"text-[#2563EB]"  },
          { label:"Resolved",        value:counts.resolved, icon:CheckCircle,  iconBg:"bg-[#EDFAF3]", iconCl:"text-[#1A9E56]"  },
        ].map(({ label, value, icon: Icon, iconBg, iconCl }) => (
          <div key={label} className="rounded-[14px] border border-[#EDE7E2] bg-white p-4 hover:shadow-[0_6px_20px_rgba(27,22,21,0.07)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-[#9E8E85]">{label}</span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${iconBg}`}><Icon size={13} strokeWidth={2} className={iconCl} /></div>
            </div>
            <p className="mt-2.5 text-[28px] font-extrabold tracking-[-0.025em] text-[#1B1615]">{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-[18px] border border-[#EDE7E2] bg-white">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#F5EFE9] p-5">
          <div className="relative flex h-[38px] min-w-[220px] flex-1 items-center gap-2 rounded-[9px] border border-[#E0D9D4] bg-white px-3 focus-within:border-[#E2484D]/60 focus-within:ring-2 focus-within:ring-[#E2484D]/10 transition-all">
            <Search size={14} strokeWidth={2} className="shrink-0 text-[#C5B8B0]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by donor or report ID..."
              className="flex-1 bg-transparent text-[13px] text-[#1B1615] placeholder:text-[#C5B8B0] outline-none"
            />
            {search && <button onClick={()=>setSearch("")}><X size={12} strokeWidth={2} className="text-[#B5A89F]" /></button>}
          </div>
          <div className="relative">
            <select value={status} onChange={e=>setStatus(e.target.value)}
              className="h-[38px] appearance-none rounded-[9px] border border-[#E0D9D4] bg-white pl-3 pr-8 text-[13px] text-[#1B1615] outline-none hover:border-[#E2484D]/30 transition-all"
            >
              <option value="">All statuses</option>
              {["Pending","Reviewed","Resolved","Dismissed"].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} strokeWidth={2} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E8E85]" />
          </div>
          {(search||status) && (
            <button onClick={()=>{setSearch("");setStatus("");}} className="flex h-[38px] items-center gap-1.5 rounded-[9px] border border-[#E0D9D4] px-3.5 text-[13px] font-medium text-[#68625E] hover:bg-[#FAF7F4] transition-all">
              <X size={13} strokeWidth={2} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#F5EFE9]">
                {["Report ID","Reported Donor","Reporter","Reason","Date","Status","Actions"].map(h=>(
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#B5A89F]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE9]">
              {filtered.length===0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-[13.5px] text-[#9E8E85]">No reports match your filters.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#FAF7F4] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12.5px] font-semibold text-[#9E8E85]">{r.id}</td>
                  <td className="px-5 py-4 text-[13.5px] font-semibold text-[#1B1615]">{r.donor}</td>
                  <td className="px-5 py-4 text-[13px] text-[#9E8E85]">{r.reporter}</td>
                  <td className="px-5 py-4 text-[13px] text-[#E2484D]">{r.reason}</td>
                  <td className="px-5 py-4 text-[13px] text-[#9E8E85]">{r.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setDrawer(r)} className="flex items-center gap-1.5 rounded-[7px] border border-[#EDE7E2] px-2.5 py-1.5 text-[12px] font-medium text-[#68625E] hover:bg-[#FAF7F4] transition-all">
                        <Eye size={12} strokeWidth={2} /> Review
                      </button>
                      {r.status !== "Resolved" && (
                        <button onClick={() => changeStatus(r.id, "Resolved")} className="flex items-center gap-1.5 rounded-[7px] border border-[#EDE7E2] px-2.5 py-1.5 text-[12px] font-medium text-[#1A9E56] hover:bg-[#EDFAF3] transition-all">
                          <Check size={12} strokeWidth={2} /> Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawer && <ReportDrawer report={drawer} onClose={() => setDrawer(null)} onStatusChange={changeStatus} />}
    </>
  );
}