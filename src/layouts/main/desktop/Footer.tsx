"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Play, Camera, BookOpen } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { usePathname } from "next/navigation";
import { PRESS_CLASS, PRESS_SOFT_CLASS } from "@/libs/press";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"] as const;

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

const EXPLORE_LINKS = [
  { labelKey: "layout.footer.now_showing", href: "/movies?status=now_showing" },
  { labelKey: "layout.footer.coming_soon", href: "/movies?status=coming_soon" },
  { labelKey: "layout.footer.all_movies", href: "/movies" },
  { labelKey: "layout.footer.my_tickets", href: "/tickets" },
] as const;

const SUPPORT_LINKS = [
  { labelKey: "layout.footer.help_center", href: "#" },
  { labelKey: "layout.footer.contact_us", href: "mailto:support@primeseat.vn" },
  { labelKey: "layout.footer.faqs", href: "#" },
  { labelKey: "layout.footer.refund_policy", href: "#" },
] as const;

const BOTTOM_LINKS = [
  { labelKey: "layout.footer.credits", href: "/credits" },
  { labelKey: "layout.footer.privacy", href: "#" },
  { labelKey: "layout.footer.terms", href: "#" },
  { labelKey: "layout.footer.cookies", href: "#" },
] as const;

export default function Footer() {
  const { translate } = useLocale();
  const pathname = usePathname();
  const authRoute = isAuthRoute(pathname);
  const [email, setEmail] = useState("");

  return (
    <footer
      className={`mt-16 border-t border-(--color-border) pb-6 pt-12 print:hidden backdrop-blur-md ${
        authRoute ? "bg-black/40" : "bg-(--color-bg)"
      }`}
    >
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-10 grid grid-cols-[1.8fr_1fr_1fr_1.6fr] gap-10">
          <div>
            <div className="mb-3.5 flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={28}
                height={28}
                className="rounded-full"
              />
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
                  type="button"
                  key={i}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-transparent text-(--color-text-muted) hover:border-(--color-gold)/40 hover:bg-(--color-gold)/10 hover:text-(--color-gold) ${PRESS_CLASS}`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest uppercase text-white">
              {translate("layout.footer.explore")}
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {EXPLORE_LINKS.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a
                    href={href}
                    className={`inline-block text-[13px] text-(--color-text-muted) no-underline hover:text-(--color-gold-light) ${PRESS_SOFT_CLASS}`}
                  >
                    {translate(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest uppercase text-white">
              {translate("layout.footer.support")}
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {SUPPORT_LINKS.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a
                    href={href}
                    className={`inline-block text-[13px] text-(--color-text-muted) no-underline hover:text-(--color-gold-light) ${PRESS_SOFT_CLASS}`}
                  >
                    {translate(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
                name="email"
                placeholder={translate("layout.footer.email_placeholder")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="flex-1 border border-r-0 border-(--color-border) bg-(--color-surface) px-3.5 py-2.5 text-xs text-white outline-none font-sans rounded-l-(--radius-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
              />
              <button
                type="button"
                className={`cursor-pointer rounded-r-(--radius-sm) border-none bg-(--color-gold) px-4 py-2.5 text-xs font-extrabold text-black hover:bg-(--color-gold-dark) ${PRESS_SOFT_CLASS}`}
              >
                {translate("layout.footer.join")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-(--color-border) pt-5">
          <div className="flex gap-5">
            {BOTTOM_LINKS.map(({ labelKey, href }) => (
              <a
                key={labelKey}
                href={href}
                className={`inline-block text-[11px] tracking-wide text-(--color-text-muted) no-underline hover:text-(--color-gold-light) ${PRESS_SOFT_CLASS}`}
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
