import { ToastQueue } from "@heroui/react";

// ── Types ──────────────────────────────────────────────────────────────────────
export type BDToastType = "success" | "warning" | "error" | "info" | "cancel" | "delete";

export interface BDToastContent {
  type:         BDToastType;
  title?:       string;
  description:  string;
  variant:      "flat";          // satisfies HeroUI's internal variant field
}

// ── Auto-dismiss durations (ms) ────────────────────────────────────────────────
const DURATIONS: Record<BDToastType, number> = {
  success: 3500,
  info:    4000,
  warning: 5000,
  error:   5500,
  cancel:  3500,
  delete:  4000,
};

// ── Singleton queue — import this wherever you need to trigger a toast ─────────
export const toastQueue = new ToastQueue<BDToastContent>();

// ── Input shape ────────────────────────────────────────────────────────────────
type ToastInput = string | { title?: string; description: string; duration?: number };

const add = (type: BDToastType, input: ToastInput) => {
  const opts    = typeof input === "string" ? { description: input } : input;
  const timeout = opts.duration ?? DURATIONS[type];

  toastQueue.add(
    { type, title: opts.title, description: opts.description, variant: "flat" },
    { timeout },
  );
};

// ── Public API ─────────────────────────────────────────────────────────────────
// Usage:
//   toast.success("Profile updated")
//   toast.error({ title: "Oops", description: "Something went wrong", duration: 6000 })
export const toast = {
  success: (input: ToastInput) => add("success", input),
  warning: (input: ToastInput) => add("warning", input),
  error:   (input: ToastInput) => add("error",   input),
  info:    (input: ToastInput) => add("info",    input),
  cancel:  (input: ToastInput) => add("cancel",  input),
  delete:  (input: ToastInput) => add("delete",  input),
};