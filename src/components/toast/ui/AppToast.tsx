"use client";

import React from "react";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastTitle,
} from "@heroui/react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Trash2,
} from "lucide-react";
import { BDToastContent, BDToastType, toastQueue } from "./toast";



// ── Variant config ─────────────────────────────────────────────────────────────
const CONFIG: Record<
  BDToastType,
  {
    Icon:       React.ElementType;
    iconClass:  string;
    bg:         string;
    border:     string;
    titleColor: string;
  }
> = {
  success: {
    Icon:       CheckCircle2,
    iconClass:  "text-[#1A9E56]",
    bg:         "bg-[#F0FBF4]",
    border:     "border-[#B8E9C8]",
    titleColor: "text-[#166534]",
  },
  warning: {
    Icon:       AlertTriangle,
    iconClass:  "text-[#D97706]",
    bg:         "bg-[#FFFBEB]",
    border:     "border-[#FDE68A]",
    titleColor: "text-[#92400E]",
  },
  error: {
    Icon:       XCircle,
    iconClass:  "text-[#E2484D]",
    bg:         "bg-[#FFF5F5]",
    border:     "border-[#FCC5C7]",
    titleColor: "text-[#9B1C1C]",
  },
  info: {
    Icon:       Info,
    iconClass:  "text-[#2563EB]",
    bg:         "bg-[#EFF6FF]",
    border:     "border-[#BFDBFE]",
    titleColor: "text-[#1E40AF]",
  },
  cancel: {
    Icon:       X,
    iconClass:  "text-[#9E8E85]",
    bg:         "bg-[#FAF7F4]",
    border:     "border-[#E7E0DB]",
    titleColor: "text-[#403A37]",
  },
  delete: {
    Icon:       Trash2,
    iconClass:  "text-[#E2484D]",
    bg:         "bg-[#FFF5F5]",
    border:     "border-[#FCC5C7]",
    titleColor: "text-[#9B1C1C]",
  },
};

// ── Provider — add <AppToastProvider /> once in your root layout ───────────────
export const AppToastProvider = () => (
  <Toast.Provider
    placement="bottom end"
    queue={toastQueue}
    width="max-content"
    style={{
      bottom: "max(24px, env(safe-area-inset-bottom))",
      right: "max(16px, env(safe-area-inset-right))",
      zIndex: 9999,
    }}
  >
    {({ toast: toastItem }) => {
      const content = toastItem.content as BDToastContent;
      const cfg     = CONFIG[content.type];
      const { Icon } = cfg;

      return (
        <Toast
          toast={toastItem}
          className={`
            ${cfg.bg} ${cfg.border}
            relative w-max min-w-[min(320px,calc(100vw-32px))]
            max-w-[min(520px,calc(100vw-32px))]
            rounded-[14px] border p-0
            shadow-[0_8px_28px_rgba(27,22,21,0.10)]
            data-[animation=entering]:animate-in
            data-[animation=entering]:slide-in-from-bottom-3
            data-[animation=entering]:fade-in
            data-[animation=entering]:duration-250
            data-[animation=exiting]:animate-out
            data-[animation=exiting]:slide-out-to-bottom-3
            data-[animation=exiting]:fade-out
            data-[animation=exiting]:duration-200
            motion-reduce:animate-none motion-reduce:duration-0
          `}
        >
          <ToastContent className="p-0">
            <div className="flex items-center gap-3 px-4 py-3.5">

              {/* Icon */}
              <div className={`shrink-0 ${cfg.iconClass}`}>
                <Icon size={17} strokeWidth={2.1} aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1 pr-7">
                {content.title && (
                  <ToastTitle
                    className={`block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-semibold leading-snug ${cfg.titleColor}`}
                  >
                    {content.title}
                  </ToastTitle>
                )}
                {content.description && (
                  <ToastDescription
                    className={`
                      mt-1 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap
                      text-[12.5px] leading-relaxed text-[#68625E]
                      max-sm:whitespace-normal max-sm:wrap-break-word
                    `}
                  >
                    {content.description}
                  </ToastDescription>
                )}
              </div>

            </div>
          </ToastContent>

          {/* Close button */}
          <Toast.CloseButton
            aria-label="Dismiss notification"
            className="
              absolute right-2.5 top-2.5
              flex h-5.5 w-5.5 items-center justify-center
              rounded-full border-none bg-transparent opacity-100 outline-none
              text-[#9E8E85] transition-all duration-150
              hover:bg-black/6 hover:text-[#403A37]
              focus-visible:ring-2 focus-visible:ring-[#E2484D]/30
              [&>svg]:h-3 [&>svg]:w-3
            "
          />
        </Toast>
      );
    }}
  </Toast.Provider>
);