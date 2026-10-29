"use client";

import { useTransition } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";
import { useAdminSidebar } from "@/features/admin/context";
import AdminButton from "@/features/admin/components/AdminButton";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";
import { setAdminThemeAction } from "@/features/admin/actions/preferences.action";
import type { AdminSidebarMode, AdminTheme } from "@/features/admin/types";

/**
 * Console preferences. Theme owns its own hook (the server re-reads the cookie
 * for the viewport colour); the sidebar reads the shell's context so this page
 * and the Cmd/Ctrl+B shortcut move the same rail.
 */
export default function SettingsPanel({ initialTheme }: { initialTheme: AdminTheme }) {
  const { translate } = useLocale();
  const { notify } = useToast();
  const { theme, setTheme } = useAdminTheme(initialTheme);
  const { isCollapsed, setSidebarMode } = useAdminSidebar();
  const [isPending, startTransition] = useTransition();

  const sidebar: AdminSidebarMode = isCollapsed ? "collapsed" : "expanded";

  const applyTheme = (nextTheme: AdminTheme) => {
    setTheme(nextTheme);
    startTransition(async () => {
      await setAdminThemeAction(nextTheme);
      notify(translate("admin.common.saved"), { variant: "success" });
    });
  };

  const applySidebar = (nextMode: AdminSidebarMode) => {
    setSidebarMode(nextMode);
    notify(translate("admin.common.saved"), { variant: "success" });
  };

  return (
    <div className={ADMIN_CARD_CLASS + " p-5 space-y-6"}>
      <section>
        <h3 className="mb-2 text-sm font-bold text-(--color-text-primary)">
          {translate("admin.settings.theme")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["dark", "light", "system"] as AdminTheme[]).map((value) => (
            <AdminButton
              key={value}
              size="sm"
              variant={theme === value ? "primary" : "outline"}
              disabled={isPending}
              onClick={() => applyTheme(value)}
            >
              {translate(`admin.settings.theme_${value}` as never)}
            </AdminButton>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-bold text-(--color-text-primary)">
          {translate("admin.settings.sidebar")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["expanded", "collapsed"] as AdminSidebarMode[]).map((value) => (
            <AdminButton
              key={value}
              size="sm"
              variant={sidebar === value ? "primary" : "outline"}
              onClick={() => applySidebar(value)}
            >
              {translate(`admin.settings.sidebar_${value}` as never)}
            </AdminButton>
          ))}
        </div>
      </section>
    </div>
  );
}
