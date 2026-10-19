"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import Tabs from "@/components/ui/Tabs";

/**
 * Now Showing / Coming Soon switch, shared by both device trees — the tab state
 * lives in the movies context, so the desktop toolbar and the mobile header
 * drive the same list.
 */
export default function MovieTabs({
  /** Spread the tabs across the row (mobile) instead of sizing them to their label (desktop). */
  stretch = true,
  className = "",
}: {
  stretch?: boolean;
  className?: string;
}) {
  const { translate } = useLocale();
  const { activeTab, setActiveTab } = useMovieList();

  const tabs = [
    { key: "now_showing", label: translate("movies.now_showing") },
    { key: "coming_soon", label: translate("movies.coming_soon") },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as "now_showing" | "coming_soon")}
      stretch={stretch}
      className={className}
    />
  );
}
