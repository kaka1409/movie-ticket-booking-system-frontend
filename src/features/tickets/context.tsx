"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Tab = "upcoming" | "past";

interface TicketsContextType {
  activeTab: Tab;
  visibleCount: number;
  setActiveTab: (tab: Tab) => void;
  loadMore: () => void;
}

const TicketsContext = createContext<TicketsContextType | null>(null);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<Tab>("upcoming");
  const [visibleCount, setVisibleCount] = useState(3);

  const setActiveTab = useCallback((tab: Tab) => {
    setActiveTabState(tab);
    setVisibleCount(3);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => c + 3);
  }, []);

  return (
    <TicketsContext.Provider value={{ activeTab, visibleCount, setActiveTab, loadMore }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets(): TicketsContextType {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error("useTickets must be used within TicketsProvider");
  return ctx;
}
