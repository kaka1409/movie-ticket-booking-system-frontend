"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { lockBodyScroll } from "@/libs/scroll-lock";
import {
  ArrowLeft,
  ChevronDown,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldAlert,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ADMIN_NAV_GROUPS, isAdminNavActive } from "@/features/admin/adminSections";
import { AdminSidebarProvider, useAdminSidebar } from "@/features/admin/context";
import { ADMIN_SIDEBAR_COLLAPSED_PX, ADMIN_SIDEBAR_EXPANDED_PX } from "@/features/admin/constants";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";
import type { AdminSidebarMode, AdminTheme } from "@/features/admin/types";
import Avatar, { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import LoginPrompt from "@/components/shared/LoginPrompt";
import Logo from "@/components/ui/Logo";

const THEME_OPTIONS: Array<{ value: AdminTheme; labelKey: string; Icon: LucideIcon }> = [
  { value: "dark", labelKey: "admin.theme.dark", Icon: Moon },
  { value: "light", labelKey: "admin.theme.light", Icon: Sun },
  { value: "system", labelKey: "admin.theme.system", Icon: Monitor },
];

/** Console route-group shell; the sidebar state lives in `AdminSidebarProvider`. */
export default function AdminLayout({
  initialTheme,
  initialSidebarMode,
  children,
}: {
  initialTheme: AdminTheme;
  initialSidebarMode: AdminSidebarMode;
  children: ReactNode;
}) {
  return (
    <AdminSidebarProvider initialMode={initialSidebarMode}>
      <AdminShell initialTheme={initialTheme}>{children}</AdminShell>
    </AdminSidebarProvider>
  );
}

/**
 * Console shell for `/admin`: header strip, persistent (collapsible) sidebar,
 * content band. It is ONE responsive tree — below 740px the sidebar becomes an
 * off-canvas drawer and tables degrade in place, with no second markup branch.
 *
 * The gate runs here rather than in a route guard: a visitor with no refresh
 * cookie never reaches this component (the server layout returns
 * `LoginPrompt`), so this only has to catch a cookie that exists but carries no
 * admin role — and it answers with a panel, never a redirect.
 */
function AdminShell({ initialTheme, children }: { initialTheme: AdminTheme; children: ReactNode }) {
  const { translate } = useLocale();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useAdminTheme(initialTheme);
  const { isCollapsed, toggleSidebar } = useAdminSidebar();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "b") return;
      event.preventDefault();
      toggleSidebar();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Drawer: focus the close control on open, trap Tab inside, Escape closes,
  // and the trigger gets focus back â€” the same contract as `ui/Dropdown`.
  useEffect(() => {
    if (!isDrawerOpen) return;

    const drawer = drawerRef.current;
    const trigger = menuButtonRef.current;
    drawer?.querySelector<HTMLElement>("[data-admin-drawer-close]")?.focus();

    const releaseScrollLock = lockBodyScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;

      const focusable = drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      releaseScrollLock();
      if (drawer?.contains(document.activeElement)) trigger?.focus();
    };
  }, [isDrawerOpen]);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const gate = !isAuthenticated ? (
    isLoading ? (
      <AdminRestoreSkeleton />
    ) : (
      <LoginPrompt />
    )
  ) : user?.role !== "ADMIN" ? (
    <AdminForbiddenPanel />
  ) : null;

  return (
    <div
      data-admin-theme={theme}
      className="flex min-h-dvh flex-col bg-(--color-bg) text-(--color-text-primary)"
    >
      {gate ?? (
        <>
          <header className="sticky top-0 z-nav flex h-16 shrink-0 items-center gap-2 border-b border-(--color-border) bg-(--color-surface) px-3 md:px-5">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label={translate("admin.sidebar.open")}
              aria-expanded={isDrawerOpen}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text-primary) md:hidden"
            >
              <Menu size={20} aria-hidden />
            </button>

            <Logo size="sm" href="/admin" />

            <span className="hidden rounded-(--radius-sm) border border-(--color-gold)/40 px-1.5 py-0.5 text-3xs font-black tracking-[0.18em] text-(--admin-accent-ink) uppercase sm:inline">
              {translate("admin.badge")}
            </span>

            <div className="ml-auto flex items-center gap-1.5 md:gap-2.5">
              <ThemeToggle theme={theme} onSelect={setTheme} />

              {user && (
                <AdminAccountMenu name={user.name} email={user.email} avatarUrl={user.avatarUrl} />
              )}
            </div>
          </header>

          <div className="flex flex-1 items-stretch">
            <aside
              className="sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 flex-col border-r border-(--color-border) bg-(--color-surface) transition-[width] duration-200 md:flex"
              style={{
                width: isCollapsed ? ADMIN_SIDEBAR_COLLAPSED_PX : ADMIN_SIDEBAR_EXPANDED_PX,
              }}
            >
              <AdminNav isCollapsed={isCollapsed} />

              <div className="shrink-0 space-y-0.5 border-t border-(--color-border) p-2">
                <Link
                  href="/"
                  prefetch={false}
                  title={translate("admin.back_to_site")}
                  className={`flex items-center rounded-xl py-2 text-[11px] font-semibold text-(--color-text-primary) no-underline transition-colors hover:bg-(--color-surface-2) hover:text-(--color-gold) ${
                    isCollapsed ? "justify-center px-0" : "gap-2.5 px-2.5"
                  }`}
                >
                  <ArrowLeft size={14} aria-hidden className="shrink-0" />
                  {isCollapsed ? (
                    <span className="sr-only">{translate("admin.back_to_site")}</span>
                  ) : (
                    <span>{translate("admin.back_to_site")}</span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={toggleSidebar}
                  title={translate(isCollapsed ? "admin.sidebar.expand" : "admin.sidebar.collapse")}
                  aria-label={translate(
                    isCollapsed ? "admin.sidebar.expand" : "admin.sidebar.collapse",
                  )}
                  className={`flex w-full cursor-pointer items-center rounded-xl py-2 text-[11px] font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-gold) ${
                    isCollapsed ? "justify-center px-0" : "gap-2.5 px-2.5"
                  }`}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen size={14} aria-hidden className="shrink-0" />
                  ) : (
                    <PanelLeftClose size={14} aria-hidden className="shrink-0" />
                  )}
                  {!isCollapsed && <span>{translate("admin.sidebar.collapse")}</span>}
                </button>
              </div>
            </aside>

            <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-5 md:px-6 md:py-7 lg:px-8">
              {children}
            </main>
          </div>
        </>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 z-overlay md:hidden">
          <button
            type="button"
            aria-label={translate("admin.sidebar.close")}
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-xs"
          />

          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={translate("admin.nav.label")}
            className="animate-fade-in absolute inset-y-0 left-0 flex w-72 max-w-[82vw] flex-col border-r border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)"
          >
            <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-(--color-border) px-4">
              <Logo size="sm" href="/admin" />
              <button
                type="button"
                data-admin-drawer-close
                onClick={closeDrawer}
                aria-label={translate("admin.sidebar.close")}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-2)"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <AdminNav onNavigate={closeDrawer} />

            <div className="shrink-0 border-t border-(--color-border) p-2">
              <Link
                href="/"
                prefetch={false}
                onClick={closeDrawer}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-(--color-text-primary) no-underline transition-colors hover:bg-(--color-surface-2) hover:text-(--color-gold)"
              >
                <ArrowLeft size={14} aria-hidden className="shrink-0" />
                <span>{translate("admin.back_to_site")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminNav({
  isCollapsed = false,
  onNavigate,
}: {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { translate } = useLocale();

  return (
    <nav
      aria-label={translate("admin.nav.label")}
      className="min-h-0 flex-1 overflow-y-auto px-2 py-3"
    >
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.labelKey} className="mb-3 last:mb-0">
          {isCollapsed ? (
            <div aria-hidden className="mx-auto mb-1.5 h-px w-8 bg-(--color-border)" />
          ) : (
            <p
              aria-hidden
              className="px-2.5 pb-1 text-3xs font-bold tracking-[0.18em] text-(--color-text-muted) uppercase"
            >
              {translate(group.labelKey)}
            </p>
          )}

          <ul>
            {group.items.map((item) => {
              const isActive = isAdminNavActive(item.href, pathname);
              const label = translate(item.labelKey);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    title={isCollapsed ? label : undefined}
                    className={`relative flex items-center rounded-xl text-[13px] font-semibold no-underline transition-colors duration-150 ${
                      isCollapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-2.5 py-2"
                    } ${
                      isActive
                        ? "bg-(--color-gold)/12 text-(--admin-accent-ink)"
                        : "text-(--color-text-primary) hover:bg-(--color-surface-2) hover:text-(--color-gold)"
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-(--color-gold)"
                      />
                    )}
                    <item.Icon size={17} aria-hidden className="shrink-0" />
                    {isCollapsed ? (
                      <span className="sr-only">{label}</span>
                    ) : (
                      <span className="truncate">{label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function ThemeToggle({
  theme,
  onSelect,
}: {
  theme: AdminTheme;
  onSelect: (theme: AdminTheme) => void;
}) {
  const { translate } = useLocale();

  return (
    <div
      role="group"
      aria-label={translate("admin.theme.label")}
      className="flex items-center rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface-2) p-0.5"
    >
      {THEME_OPTIONS.map(({ value, labelKey, Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={isActive}
            aria-label={translate(labelKey)}
            title={translate(labelKey)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-(--radius-pill) transition-colors duration-150 ${
              isActive
                ? "bg-(--color-gold) text-(--color-on-accent)"
                : "text-(--color-text-muted) hover:text-(--color-text-primary)"
            }`}
          >
            <Icon size={14} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

function AdminAccountMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl: string | null;
}) {
  const { translate } = useLocale();
  const { logout, isLoggingOut } = useLogout();

  return (
    <Dropdown
      label={translate("layout.header.account")}
      panelClassName="w-64"
      trigger={({ isOpen }) => (
        <span
          className={`flex shrink-0 items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) py-1 pr-2.5 pl-1.5 transition-colors ${
            isOpen ? "border-(--color-gold)/50" : "hover:border-(--color-gold)/40"
          }`}
        >
          <Avatar src={avatarUrl} fallbackSrc={DEFAULT_AVATAR_SRC} name={name} size="h-7 w-7" />
          <span className="hidden max-w-[9rem] truncate text-xs font-bold text-(--color-text-primary) lg:block">
            {name}
          </span>
          <ChevronDown
            size={14}
            aria-hidden
            className={`text-(--color-text-muted) transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center gap-3 border-b border-(--color-border) px-4 py-3">
            <Avatar src={avatarUrl} fallbackSrc={DEFAULT_AVATAR_SRC} name={name} size="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-(--color-text-primary)">{name}</p>
              <p className="truncate text-[11px] text-(--color-text-muted)">{email}</p>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              href="/admin/settings"
              onClick={close}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-semibold text-(--color-text-primary) no-underline transition-colors hover:bg-(--color-surface-2) hover:text-(--color-gold)"
            >
              <Settings size={15} aria-hidden />
              <span>{translate("admin.nav.settings")}</span>
            </Link>

            <Link
              href="/"
              prefetch={false}
              onClick={close}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-semibold text-(--color-text-primary) no-underline transition-colors hover:bg-(--color-surface-2) hover:text-(--color-gold)"
            >
              <ArrowLeft size={15} aria-hidden />
              <span>{translate("admin.back_to_site")}</span>
            </Link>
          </div>

          <div className="border-t border-(--color-border) p-1.5">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => {
                close();
                void logout();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              <LogOut size={15} aria-hidden />
              <span>{translate("profile.logout")}</span>
            </button>
          </div>
        </>
      )}
    </Dropdown>
  );
}

/** Shown while `AuthContext` restores the session from the refresh cookie. */
function AdminRestoreSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-24">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-2/3 rounded-lg bg-(--color-surface-2)" />
        <div className="h-4 w-full rounded-lg bg-(--color-surface-2)" />
        <div className="h-4 w-5/6 rounded-lg bg-(--color-surface-2)" />
        <div className="h-12 w-full rounded-xl bg-(--color-surface-2)" />
      </div>
    </div>
  );
}

function AdminForbiddenPanel() {
  const { translate } = useLocale();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-gold)/12 text-(--admin-accent-ink)">
        <ShieldAlert size={26} aria-hidden />
      </span>
      <h1 className="text-lg font-extrabold text-(--color-text-primary)">
        {translate("admin.gate.forbidden_title")}
      </h1>
      <p className="text-[13px] text-(--color-text-muted)">
        {translate("admin.gate.forbidden_body")}
      </p>
      <Link
        href="/"
        prefetch={false}
        className="mt-2 flex items-center gap-2 rounded-xl border border-(--color-border) px-4 py-2.5 text-xs font-bold tracking-wide text-(--color-text-secondary) no-underline uppercase transition-colors hover:border-(--color-gold)/40 hover:text-(--admin-accent-ink)"
      >
        <ArrowLeft size={14} aria-hidden />
        {translate("admin.gate.back_home")}
      </Link>
    </div>
  );
}
