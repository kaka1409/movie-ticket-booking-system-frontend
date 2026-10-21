"use client";

import { X } from "lucide-react";
import type { ReactNode, ElementType } from "react";
import { useLocale } from "@/contexts/LocaleContext";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ActionRowProps {
  icon: ElementType;
  label: string;
  description: string;
  danger?: boolean;
  onClick: () => void;
}

export default function ActionSheet({ isOpen, onClose, children }: ActionSheetProps) {
  const { translate } = useLocale();

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 max-w-md mx-auto bg-(--color-bg) rounded-t-3xl shadow-[--shadow-card] transition-transform duration-300 ease-out ${
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

export function ActionRow({
  icon: Icon,
  label,
  description,
  danger = false,
  onClick,
}: ActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start gap-4 py-4 px-3 rounded-xl text-left transition-all duration-150 active:scale-[0.98] hover:bg-(--color-surface-2) ${
        danger ? "text-red-400" : "text-(--color-text-primary)"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-(--color-surface-2) ${
          danger ? "bg-red-500/10" : ""
        }`}
      >
        <Icon size={18} />
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span
          className={`text-sm font-bold ${danger ? "text-red-400" : "text-(--color-text-primary)"}`}
        >
          {label}
        </span>
        <span className="text-xs text-(--color-text-muted)">{description}</span>
      </span>
    </button>
  );
}
