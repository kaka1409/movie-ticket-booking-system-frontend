"use client";

import Link from "next/link";
import { ChevronRight, FlaskConical } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND, toLocaleTag } from "@/libs/utils";
import type { AdminPaymentHealth } from "@/features/admin/types";

interface PaymentHealthCardProps {
  health: AdminPaymentHealth;
}

/**
 * Payment operations panel: demo-mode banner plus per-method settlement stats
 * for the last 30 days, so an operator can see which gateway is actually
 * carrying volume before reconciling.
 */
export default function PaymentHealthCard({ health }: PaymentHealthCardProps) {
  const { locale, translate } = useLocale();

  return (
    <section
      aria-label={translate("admin.dashboard.payment_health_title")}
      className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-(--color-text-primary)">
            {translate("admin.dashboard.payment_health_title")}
          </h2>
          <p className="text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.payment_health_subtitle")}
          </p>
        </div>

        <Link
          href="/admin/payment-methods"
          prefetch={false}
          className="group inline-flex items-center gap-1 text-2xs font-semibold text-(--color-text-secondary) no-underline transition-colors hover:text-(--admin-accent-ink)"
        >
          <span>{translate("admin.dashboard.payment_health_manage")}</span>
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {health.demoMode && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
          <FlaskConical size={15} aria-hidden className="shrink-0 text-amber-500" />
          <p className="text-2xs font-medium text-amber-500">
            {translate("admin.dashboard.payment_demo_banner")}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {health.methods.map((method) => {
          const sellable = method.isActive && method.adapterEnabled;
          const label =
            locale === "vn" && method.nameVi ? method.nameVi : method.nameEn;
          const stats = [
            {
              key: "success",
              value: method.stats.success,
              className: "text-emerald-500",
            },
            {
              key: "failed",
              value: method.stats.failed,
              className: method.stats.failed > 0 ? "text-rose-500" : "text-(--color-text-muted)",
            },
            {
              key: "pending",
              value: method.stats.pending,
              className: "text-amber-500",
            },
            {
              key: "expired",
              value: method.stats.expired,
              className: "text-(--color-text-muted)",
            },
          ];

          return (
            <div
              key={method.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-(--color-border)/50 bg-(--color-surface-2)/30 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-bold text-(--color-text-primary)">
                    {label}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-3xs font-semibold ${
                      sellable
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-(--color-surface-2) text-(--color-text-muted)"
                    }`}
                  >
                    {sellable
                      ? translate("admin.dashboard.payment_status_live")
                      : translate("admin.dashboard.payment_status_off")}
                  </span>
                </div>
                <p className="mt-0.5 text-3xs text-(--color-text-muted)">
                  {formatVND(method.stats.revenue, locale)} ·{" "}
                  {translate("admin.dashboard.payment_revenue_30d")}
                </p>
              </div>

              <div className="flex items-center gap-3 text-2xs">
                {stats.map((stat) => (
                  <span key={stat.key} className="flex items-baseline gap-1">
                    <span className={`font-bold ${stat.className}`}>
                      {stat.value.toLocaleString(toLocaleTag(locale))}
                    </span>
                    <span className="text-(--color-text-muted)">
                      {translate(`admin.dashboard.payment_stat_${stat.key}`)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
