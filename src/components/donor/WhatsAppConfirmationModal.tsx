"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onConfirm: () => Promise<string | null>;
  onClose: () => void;
}

const CLOSE_DURATION_MS = 200;

export function WhatsAppConfirmationModal({ onConfirm, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const closing = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeModal = useCallback(() => {
    if (closing.current || submitting) return;
    closing.current = true;
    setVisible(false);
    closeTimer.current = setTimeout(onClose, CLOSE_DURATION_MS);
  }, [onClose, submitting]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, submitting]);

  const confirm = async () => {
    if (submitting || closing.current) return;
    setSubmitting(true);
    try {
      const url = await onConfirm();
      if (!url) {
        setSubmitting(false);
        return;
      }

      closing.current = true;
      setVisible(false);
      closeTimer.current = setTimeout(() => {
        onClose();
        window.location.assign(url);
      }, CLOSE_DURATION_MS);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close WhatsApp confirmation"
        onClick={closeModal}
        disabled={submitting}
        className={`absolute inset-0 bg-[#1B1615]/30 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-confirmation-title"
        className={`relative w-full max-w-[380px] rounded-[20px] border border-[#EDE7E2] bg-white p-6 shadow-[0_32px_80px_rgba(27,22,21,0.18)] transition-all duration-200 ease-out ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        }`}
      >
        <h2
          id="whatsapp-confirmation-title"
          className="text-[17px] font-extrabold tracking-[-0.02em] text-[#1B1615]"
        >
          Are you sure?
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#68625E]">
          You are about to contact this donor on WhatsApp.
        </p>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={closeModal}
            disabled={submitting}
            className="h-[40px] rounded-[10px] border border-[#E0D9D4] bg-white px-5 text-[13px] font-semibold text-[#68625E] transition-colors hover:bg-[#FAF7F4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={submitting}
            className="h-[40px] rounded-[10px] bg-[#E2484D] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D83E43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Opening…" : "Yes"}
          </button>
        </div>
      </section>
    </div>
  );
}
