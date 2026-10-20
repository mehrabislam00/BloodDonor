"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminManagementControls({
  userId,
  isDonor,
  isBanned,
}: {
  userId: string;
  isDonor: boolean;
  isBanned: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(action: "delete-user" | "ban-donor" | "unban-donor") {
    const message = action === "delete-user"
      ? "Soft-delete this user and archive their profile?"
      : action === "ban-donor"
        ? "Ban this donor? They will be blocked from login and hidden from public donor search."
        : "Lift this donor ban?";
    if (!window.confirm(message)) return;
    const reason = action === "ban-donor" ? window.prompt("Enter the reason for this ban:")?.trim() ?? "" : "";
    if (action === "ban-donor" && !reason) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId, reason }),
      });
      if (!response.ok) throw new Error("Admin action failed.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {isDonor && (
        <button
          type="button"
          disabled={busy}
          onClick={() => run(isBanned ? "unban-donor" : "ban-donor")}
          className="rounded-md border border-[#F0B4B6] px-2 py-1 text-[11px] font-semibold text-[#B92F35] hover:bg-[#FFF5F5] disabled:opacity-50"
        >
          {isBanned ? "Unban donor" : "Ban donor"}
        </button>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => run("delete-user")}
        className="rounded-md border border-[#EDE7E2] px-2 py-1 text-[11px] font-semibold text-[#68625E] hover:bg-[#FAF7F4] disabled:opacity-50"
      >
        Delete user
      </button>
    </div>
  );
}
