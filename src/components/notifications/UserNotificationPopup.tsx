"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, LogOut, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SUPPORT_EMAIL } from "@/lib/support";

type Notification = {
  id: string; title: string; message: string; type: string; severity: string;
  deadline: string | null; requiresAcknowledgement: boolean; blocksInteraction: boolean;
  createdAt: string; acknowledgedAt: string | null; readAt: string | null;
};

export default function UserNotificationPopup() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (!response.ok) return;
    setNotifications((await response.json()).notifications ?? []);
  }, [session?.user]);

  useEffect(() => {
    if (isPending || !session?.user) return;
    const timer = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(() => void load(), 15000);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, [isPending, session?.user, load]);

  const current = useMemo(() => notifications.find((notification) =>
    notification.blocksInteraction && !notification.acknowledgedAt
  ) ?? notifications.find((notification) => !notification.readAt), [notifications]);
  if (!current || !session?.user) return null;
  const activeNotification = current;

  async function update(action: "read" | "acknowledge") {
    setBusy(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: activeNotification.id, action }),
      });
      if (response.ok) await load();
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  const mandatory = activeNotification.requiresAcknowledgement || activeNotification.blocksInteraction;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B1615]/45 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="notification-title" className="w-full max-w-lg rounded-2xl border border-[#EDE7E2] bg-white p-6 shadow-[0_20px_60px_rgba(27,22,21,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activeNotification.severity === "critical" ? "bg-[#FFE4E4] text-[#E2484D]" : "bg-[#FFF6DD] text-[#B45309]"}`}><AlertTriangle size={19} /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E2484D]">{activeNotification.type} notice</p><h2 id="notification-title" className="mt-1 text-xl font-extrabold text-[#1B1615]">{activeNotification.title}</h2></div>
          </div>
          {!mandatory && <button onClick={() => void update("read")} aria-label="Close notification"><X size={18} /></button>}
        </div>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[#403A37]">{activeNotification.message}</p>
        {activeNotification.deadline && <p className="mt-4 rounded-lg bg-[#FAF7F4] p-3 text-xs text-[#68625E]">Required by: {new Date(activeNotification.deadline).toLocaleString()}</p>}
        <p className="mt-4 text-xs text-[#9E8E85]">Issued {new Date(activeNotification.createdAt).toLocaleString()}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(activeNotification.title)}`} className="rounded-lg border border-[#E0D9D4] px-3 py-2 text-sm font-semibold text-[#68625E]">Contact Support</a>
          {activeNotification.type !== "ban" && <button onClick={() => void update("acknowledge")} disabled={busy} className="rounded-lg bg-[#E2484D] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check size={14} className="mr-1 inline" />Acknowledge</button>}
          {activeNotification.type === "ban" && <button onClick={() => void logout()} disabled={busy} className="rounded-lg bg-[#E2484D] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><LogOut size={14} className="mr-1 inline" />Log out</button>}
        </div>
      </section>
    </div>
  );
}
