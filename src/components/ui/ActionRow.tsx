"use client";

import type { ElementType } from "react";
import { PRESS_ROW_CLASS } from "@/libs/press";

type ActionRowVariant = "mobile" | "desktop";

interface ActionRowProps {
  icon: ElementType;
  label: string;
  description: string;
  danger?: boolean;
  variant?: ActionRowVariant;
  onClick?: () => void;
  href?: string;
}

const variantClasses: Record<ActionRowVariant, string> = {
  mobile: "py-4 px-3 active:scale-[0.98]",
  desktop: "py-3.5 px-4 active:scale-[0.99]",
};

export default function ActionRow({
  icon: Icon,
  label,
  description,
  danger = false,
  variant = "mobile",
  onClick,
  href,
}: ActionRowProps) {
  const baseClasses = `
    w-full flex items-start gap-4 rounded-xl text-left transition duration-150
    ${PRESS_ROW_CLASS}
    ${variantClasses[variant]}
    ${danger ? "text-red-400" : "text-(--color-text-primary)"}
    hover:bg-(--color-surface-2)
  `;

  const iconContainerClasses = `
    flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-(--color-surface-2)
    ${danger ? "bg-red-500/10" : ""}
  `;

  const content = (
    <>
      <span className={iconContainerClasses}>
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
    </>
  );

  if (href !== undefined) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
