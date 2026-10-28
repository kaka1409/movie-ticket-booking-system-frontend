"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function TrailerModal({ isOpen, onClose, title }: TrailerModalProps) {
  const { translate } = useLocale();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-(--color-border) px-6 py-4">
          <h3 className="text-base font-bold text-white">Trailer: {title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:bg-(--color-surface-2) hover:text-white"
            aria-label={translate("common.close")}
          >
            <X size={20} />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
