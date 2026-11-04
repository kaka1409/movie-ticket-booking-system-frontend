"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { lockBodyScroll } from "@/libs/scroll-lock";
import { useLocale } from "@/contexts/LocaleContext";
import ActionRow from "./ActionRow";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ActionSheet({ isOpen, onClose, children }: ActionSheetProps) {
  const { translate } = useLocale();

  useEffect(() => {
    if (!isOpen) return;
    const releaseScrollLock = lockBodyScroll();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      releaseScrollLock();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-overlay ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 cursor-pointer bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 max-w-md mx-auto bg-(--color-bg) rounded-t-3xl shadow-(--shadow-card) transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative flex items-center justify-center px-4 pt-4 pb-2">
          <div className="w-10 h-1 rounded-full bg-(--color-border)" />
          <button
            type="button"
            onClick={onClose}
            aria-label={translate("common.close")}
            className="absolute right-4 top-3.5 p-1.5 rounded-full text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-2 pb-8 overflow-y-auto max-h-[70dvh]">{children}</div>
      </div>
    </div>
  );
}

export { ActionRow };
