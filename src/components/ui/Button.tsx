"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "loadMore" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-(--color-gold) text-(--color-on-accent) shadow-(--shadow-glow)",
  outline: "border border-(--color-gold) text-(--color-gold) bg-transparent",
  loadMore:
    "border border-(--color-border) bg-(--color-surface) text-(--color-gold-light) hover:border-(--color-gold)/40 hover:text-(--color-gold)",
  /** Irreversible action (cancel a booking) — outlined, never a filled red block. */
  danger: "border border-red-500/60 text-red-400 bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-3 text-xs tracking-wide rounded-xl",
  md: "py-3.5 text-sm tracking-widest rounded-2xl",
  lg: "py-4 text-sm tracking-widest rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth = true,
  uppercase = true,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "right",
  children,
  onClick,
  href,
  type = "button",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  uppercase?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  children: ReactNode;
  onClick?: () => void;
  /** Navigation target — renders a `<Link>` (a disabled/loading button wins over it). */
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}) {
  const iconSize = size === "sm" ? 14 : 17;

  const classes = `
        flex items-center justify-center gap-2.5 font-extrabold
        transition duration-150 active:scale-[0.98]
        disabled:opacity-40 disabled:pointer-events-none
        ${fullWidth ? "w-full" : ""}
        ${uppercase ? "uppercase" : ""}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${variant === "primary" ? "hover:opacity-90" : ""}
        ${className}
      `;

  const content = loading ? (
    <>
      <Loader2 size={iconSize} className="animate-spin" />
      {children}
    </>
  ) : (
    <>
      {Icon && iconPosition === "left" && <Icon size={iconSize} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={iconSize} />}
    </>
  );

  if (href !== undefined && !disabled && !loading) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
      {content}
    </button>
  );
}
