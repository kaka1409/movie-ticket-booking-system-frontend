"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { setAdminSidebarAction } from "./actions/preferences.action";
import type { AdminSidebarMode } from "./types";

interface AdminSidebarContextValue {
  isCollapsed: boolean;
  setSidebarMode: (mode: AdminSidebarMode) => void;
  toggleSidebar: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);

/**
 * One owner for the console sidebar width: the shell renders it, the Cmd/Ctrl+B
 * shortcut flips it and `/admin/settings` edits it — two copies of the state
 * meant a settings click never moved the rail.
 *
 * The write is optimistic and cookie-backed; the collapsed rail is client state
 * only, so no `router.refresh()` is needed (the cookie is read on the next full
 * render of the admin layout).
 */
export function AdminSidebarProvider({
  initialMode,
  children,
}: {
  initialMode: AdminSidebarMode;
  children: ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(initialMode === "collapsed");
  const [syncedMode, setSyncedMode] = useState(initialMode);

  if (initialMode !== syncedMode) {
    setSyncedMode(initialMode);
    setIsCollapsed(initialMode === "collapsed");
  }

  const setSidebarMode = useCallback((mode: AdminSidebarMode) => {
    setIsCollapsed(mode === "collapsed");
    void setAdminSidebarAction(mode);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarMode(isCollapsed ? "expanded" : "collapsed");
  }, [isCollapsed, setSidebarMode]);

  const value = useMemo(
    () => ({ isCollapsed, setSidebarMode, toggleSidebar }),
    [isCollapsed, setSidebarMode, toggleSidebar],
  );

  return <AdminSidebarContext.Provider value={value}>{children}</AdminSidebarContext.Provider>;
}

export function useAdminSidebar(): AdminSidebarContextValue {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error("useAdminSidebar must be used inside AdminSidebarProvider");
  }
  return context;
}
