"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminReportDeleteButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function removeReport() {
    if (!window.confirm("Delete this report?")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-report", reportId }),
      });
      if (!response.ok) throw new Error("Unable to delete report.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={removeReport}
      className="mt-3 rounded-md border border-[#F0B4B6] px-2 py-1 text-[11px] font-semibold text-[#B92F35] hover:bg-[#FFF5F5] disabled:opacity-50"
    >
      Delete report
    </button>
  );
}
