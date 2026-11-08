"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogIn, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import AuthGateShell from "@/components/shared/AuthGateShell";
import LoginPromptArt from "@/components/shared/LoginPromptArt";
import { useLocale } from "@/contexts/LocaleContext";
import { buildLoginUrl, buildRegisterUrl } from "@/features/auth/utils";

/**
 * Responsive LoginPrompt:
 * - Mobile (< md): Exactly like the original design — no container card, plain chrome-less stack.
 * - Tablet & Desktop (>= md): 50/50 split container matching Home (`max-w-7xl`),
 *   with abstract interactive cinema art on the left and authentication actions + 3 expandable
 *   privileges on the right.
 */
export default function LoginPrompt() {
  const pathname = usePathname();
  const { translate } = useLocale();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const togglePrivilege = (index: number) => {
    setExpandedIndex((previous) => (previous === index ? null : index));
  };

  const privileges = [
    {
      id: "01",
      title: translate("auth.protected.privilege_1_title"),
      description: translate("auth.protected.privilege_1_desc"),
    },
    {
      id: "02",
      title: translate("auth.protected.privilege_2_title"),
      description: translate("auth.protected.privilege_2_desc"),
    },
    {
      id: "03",
      title: translate("auth.protected.privilege_3_title"),
      description: translate("auth.protected.privilege_3_desc"),
    },
  ];

  return (
    <AuthGateShell>
      <div className="surface-raised flex w-full max-w-xs flex-col items-center gap-4 text-center md:hidden">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface)">
          <LogIn size={28} className="text-(--color-text-muted)" />
        </div>
        <div>
          <p className="text-lg font-bold text-(--color-text-primary)">
            {translate("auth.protected.title")}
          </p>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            {translate("auth.protected.description")}
          </p>
        </div>
        <Button href={buildLoginUrl(pathname)} icon={LogIn} iconPosition="left">
          {translate("auth.protected.login_btn")}
        </Button>
        <p className="text-xs text-(--color-text-muted)">
          {translate("auth.login.no_account")}{" "}
          <Link
            href={buildRegisterUrl(pathname)}
            className="font-bold text-(--color-gold) hover:underline"
          >
            {translate("auth.login.register_link")}
          </Link>
        </p>
      </div>

      <div className="surface-raised mx-auto hidden w-full max-w-7xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) md:block md:rounded-3xl">
        <div className="grid min-h-[580px] grid-cols-2 lg:min-h-[640px]">
          <div className="border-r border-(--color-border)">
            <LoginPromptArt />
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div>
              <span className="text-2xs font-bold uppercase tracking-[0.25em] text-(--color-gold)">
                {translate("auth.protected.privilege_tag")}
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-(--color-text-primary) sm:text-3xl lg:text-4xl">
                {translate("auth.protected.title")}
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-(--color-text-muted)">
                {translate("auth.protected.description")}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  href={buildLoginUrl(pathname)}
                  variant="primary"
                  size="md"
                  icon={LogIn}
                  iconPosition="left"
                  fullWidth={false}
                  uppercase={false}
                  className="sm:min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-bold shadow-none"
                >
                  {translate("auth.protected.login_btn")}
                </Button>
                <Button
                  href={buildRegisterUrl(pathname)}
                  variant="outline"
                  size="md"
                  fullWidth={false}
                  uppercase={false}
                  className="sm:min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-bold"
                >
                  {translate("auth.protected.register_btn")}
                </Button>
              </div>
            </div>

            <div className="mt-10 border-t border-(--color-border) pt-6">
              <p className="mb-3 text-2xs font-bold uppercase tracking-[0.2em] text-(--color-text-muted)">
                {translate("auth.protected.privilege_toggle_show")}
              </p>

              <div className="flex flex-col gap-2.5">
                {privileges.map((privilege, index) => {
                  const isExpanded = expandedIndex === index;
                  return (
                    <div
                      key={privilege.id}
                      className={`rounded-xl border transition-all duration-200 ${
                        isExpanded
                          ? "border-(--color-gold)/40 bg-(--color-surface-2)"
                          : "border-(--color-border) bg-transparent hover:border-(--color-border-strong)"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePrivilege(index)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-(--color-gold)">
                            {privilege.id}
                          </span>
                          <span className="text-xs font-bold text-(--color-text-primary)">
                            {privilege.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-(--color-text-muted) transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-(--color-gold)" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-200 ease-out ${
                          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-4 pb-3 pt-0.5 text-2xs leading-relaxed text-(--color-text-muted)">
                            {privilege.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-2 text-3xs text-(--color-text-muted)">
                <ShieldCheck size={14} className="shrink-0 text-(--color-gold)" />
                <span>{translate("auth.protected.security_note")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGateShell>
  );
}
