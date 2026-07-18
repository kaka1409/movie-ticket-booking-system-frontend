"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Play, Camera, BookOpen } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const CINEMA_LINKS = [
  { labelKey: "layout.footer.find_cinema", href: "#" },
  { labelKey: "layout.footer.movie_grids", href: "#" },
  { labelKey: "layout.footer.cinematic_tech", href: "#" },
  { labelKey: "layout.footer.sitemap", href: "#" },
] as const;

const SUPPORT_LINKS = [
  { labelKey: "layout.footer.help_center", href: "#" },
  { labelKey: "layout.footer.contact_us", href: "#" },
  { labelKey: "layout.footer.gift_cards", href: "#" },
  { labelKey: "layout.footer.refunds", href: "#" },
] as const;

const BOTTOM_LINKS = [
  { labelKey: "layout.footer.privacy", href: "#" },
  { labelKey: "layout.footer.terms", href: "#" },
  { labelKey: "layout.footer.cookies", href: "#" },
] as const;

export default function Footer() {
  const { translate } = useLocale();
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-16 border-t border-(--color-border) bg-(--color-bg) pb-6 pt-12">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-10 grid grid-cols-[1.8fr_1fr_1fr_1.6fr] gap-10">
          {/* Brand */}
          <div>
            <div className="mb-3.5 flex items-center gap-2">
              <Image src="/images/logo.png" alt="Logo" width={28} height={28} className="rounded-full" />
              <span className="text-[15px] font-extrabold text-(--color-gold-light)">
                PrimeSeat
              </span>
            </div>
            <p className="mb-5 max-w-[220px] text-xs leading-relaxed text-(--color-text-muted)">
              {translate("layout.footer.description")}
            </p>
            <div className="flex gap-2.5">
              {[X, Play, Camera, BookOpen].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-transparent text-(--color-text-muted)"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Cinema links */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest uppercase text-white">
              {translate("layout.footer.cinema")}
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {CINEMA_LINKS.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a href={href} className="text-[13px] text-(--color-text-muted) no-underline hover:text-(--color-gold-light)">
                    {translate(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest uppercase text-white">
              {translate("layout.footer.support")}
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {SUPPORT_LINKS.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a href={href} className="text-[13px] text-(--color-text-muted) no-underline hover:text-(--color-gold-light)">
                    {translate(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold tracking-widest uppercase text-white">
              {translate("layout.footer.subscribe")}
            </h4>
            <p className="mb-3.5 text-xs leading-relaxed text-(--color-text-muted)">
              {translate("layout.footer.subscribe_desc")}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder={translate("layout.footer.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-r-0 border-(--color-border) bg-(--color-surface) px-3.5 py-2.5 text-xs text-white outline-none font-sans rounded-l-(--radius-sm)"
              />
              <button className="cursor-pointer rounded-r-(--radius-sm) border-none bg-(--color-gold) px-4 py-2.5 text-xs font-extrabold text-black">
                {translate("layout.footer.join")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-(--color-border) pt-5">
          <div className="flex gap-5">
            {BOTTOM_LINKS.map(({ labelKey, href }) => (
              <a
                key={labelKey}
                href={href}
                className="text-[11px] text-(--color-text-muted) no-underline tracking-wide"
              >
                {translate(labelKey)}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-(--color-text-muted)">
            {translate("layout.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
