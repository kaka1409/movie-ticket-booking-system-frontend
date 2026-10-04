import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "dark" | "gold" | "success" | "error";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-(--color-surface-2) text-(--color-text-secondary) border border-(--color-border)",
  dark: "bg-black/80 text-(--color-text-secondary) border border-(--color-border)",
  gold: "bg-(--color-gold)/10 text-(--color-gold)",
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
};

export default function Badge({
  variant = "neutral",
  size = "sm",
  icon: Icon,
  children,
  className = "",
}: {
  variant?: BadgeVariant;
  size?: "xs" | "sm";
  icon?: React.ElementType;
  children: ReactNode;
  className?: string;
}) {
  const sizeClasses = size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold tracking-wide ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon size={size === "xs" ? 9 : 10} />}
      {children}
    </span>
  );
}
