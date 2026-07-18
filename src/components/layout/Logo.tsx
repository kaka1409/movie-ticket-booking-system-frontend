"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

interface LogoProps {
  size?: "sm" | "lg";
  tagline?: boolean;
  href?: string;
}

export default function Logo({
  size = "sm",
  tagline = false,
  href = "/",
}: LogoProps) {
  const { translate } = useLocale();
  const dimensions = size === "sm" ? 20 : 32;

  return (
    <Link href={href} className="flex shrink-0 items-center gap-2 select-none">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={dimensions}
        height={dimensions}
        className={size === "lg" ? "rounded-full" : undefined}
      />
      <span
        className={`font-extrabold tracking-tight text-(--color-gold-light) ${
          size === "sm" ? "text-lg" : "text-[15px]"
        }`}
      >
        {size === "sm" ? "PRIMESEAT" : "PrimeSeat"}
      </span>
      {tagline && (
        <span className="ml-1 text-[9px] font-semibold tracking-widest uppercase text-(--color-text-muted)">
          {translate("common.cinematic_excellence")}
        </span>
      )}
    </Link>
  );
}
