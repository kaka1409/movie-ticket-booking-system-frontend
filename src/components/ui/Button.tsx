"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "loadMore";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-(--color-gold) text-(--color-bg) shadow-(--shadow-glow)",
  outline: "border border-(--color-gold) text-(--color-gold) bg-transparent",
  loadMore:
    "border border-(--color-border) bg-(--color-surface) text-(--color-gold-light) hover:border-(--color-gold)/40 hover:text-(--color-gold)",
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
  type?: "button" | "submit" | "reset";
  className?: string;
}) {
  const iconSize = size === "sm" ? 14 : 17;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2.5 font-extrabold
        transition-all duration-150 active:scale-[0.98]
        disabled:opacity-40 disabled:pointer-events-none
        ${fullWidth ? "w-full" : ""}
        ${uppercase ? "uppercase" : ""}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${variant === "primary" ? "hover:opacity-90" : ""}
        ${className}
      `}
    >
      {loading ? (
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
      )}
    </button>
  );
}
