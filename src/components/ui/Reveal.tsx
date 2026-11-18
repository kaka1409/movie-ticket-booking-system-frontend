"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMounted } from "@/hooks/useMounted";

type RevealVariant = "rise" | "rise-lg" | "scale" | "fade";

const VARIANT_CLASSES: Record<RevealVariant, { hidden: string; shown: string }> = {
  rise: { hidden: "opacity-0 translate-y-4", shown: "opacity-100 translate-y-0" },
  "rise-lg": { hidden: "opacity-0 translate-y-6", shown: "opacity-100 translate-y-0" },
  scale: { hidden: "opacity-0 scale-50", shown: "opacity-100 scale-100" },
  fade: { hidden: "opacity-0", shown: "opacity-100" },
};

/**
 * Staged entry animation for the status/result screens: hidden until mounted,
 * then transitions in. `delay`/`duration` go through inline style because
 * Tailwind cannot see dynamically-built `delay-[…]`/`duration-…` classes.
 */
export default function Reveal({
  variant = "rise",
  delay = 0,
  duration = 700,
  as: Tag = "div",
  className = "",
  children,
}: {
  variant?: RevealVariant;
  /** Milliseconds before the transition starts. */
  delay?: number;
  /** Transition length in milliseconds. */
  duration?: number;
  as?: "div" | "aside";
  className?: string;
  children: ReactNode;
}) {
  const mounted = useMounted();
  const { hidden, shown } = VARIANT_CLASSES[variant];
  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <Tag className={`transition ${mounted ? shown : hidden} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
