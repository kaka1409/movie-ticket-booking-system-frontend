"use client";

import type { ElementType } from "react";
import { PRESS_ROW_CLASS } from "@/libs/press";

interface SlideOutActionProps {
  icon: ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

export default function SlideOutAction({
  icon: Icon,
  label,
  href,
  onClick,
  danger = false,
}: SlideOutActionProps) {
  const baseClasses = `
    flex items-center gap-3 rounded-xl overflow-hidden transition-all duration-300 ease-out
    ${PRESS_ROW_CLASS}
    ${danger ? "text-red-400 hover:bg-red-500/10" : "text-(--color-text-primary) hover:bg-(--color-surface-2)"}
    w-10 hover:w-auto
  `;

  const iconContainerClasses = `
    flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-(--color-surface-2)
    ${danger ? "bg-red-500/10" : ""}
  `;

  const textClasses = `
    text-sm font-bold whitespace-nowrap opacity-0 max-w-0
    transition-all duration-300 ease-out
    group-hover:opacity-100 group-hover:max-w-32
  `;

  const content = (
    <>
      <span className={iconContainerClasses}>
        <Icon size={18} />
      </span>
      <span className={textClasses}>{label}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <a href={href} className={`${baseClasses} group`}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} group`}>
      {content}
    </button>
  );
}
