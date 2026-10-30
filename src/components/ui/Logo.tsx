"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  /** `mark` = large image only (auth cards). `lockup` = small image + wordmark (headers). */
  variant?: "mark" | "lockup";
  size?: LogoSize;
  tagline?: boolean;
  href?: string;
}

const MARK_SIZE: Record<LogoSize, number> = { sm: 48, md: 64, lg: 80 };
const LOCKUP_SIZE: Record<LogoSize, number> = { sm: 20, md: 20, lg: 32 };

/**
 * Single logo implementation. `mark` is the standalone image used on auth cards;
 * `lockup` is the linked image + wordmark used in headers, footers and the
 * not-found page.
 */
export default function Logo({
  variant = "lockup",
  size = "sm",
  tagline = false,
  href = "/",
}: LogoProps) {
  const { translate } = useLocale();

  if (variant === "mark") {
    const dimension = MARK_SIZE[size];
    return (
      <Image
        src="/images/logo.png"
        alt="PrimeSeat"
        width={dimension}
        height={dimension}
        className={size === "lg" ? "rounded-full" : undefined}
      />
    );
  }

  const dimension = LOCKUP_SIZE[size === "md" ? "sm" : size];
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2 select-none">
      <Image
        src="/images/logo.png"
        alt="PrimeSeat"
        width={dimension}
        height={dimension}
        className={size === "lg" ? "rounded-full" : undefined}
      />
      <span
        className={`font-extrabold tracking-tight text-(--color-gold-light) ${
          size === "lg" ? "text-[15px]" : "text-lg"
        }`}
      >
        {size === "lg" ? "PrimeSeat" : "PRIMESEAT"}
      </span>
      {tagline && (
        <span className="ml-1 hidden text-3xs font-semibold tracking-widest uppercase text-(--color-text-muted) lg:inline">
          {translate("common.cinematic_excellence")}
        </span>
      )}
    </Link>
  );
}
