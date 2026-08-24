"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/features/movies/context";
import Tabs from "@/components/ui/Tabs";

export default function TabsComponent() {
  const { translate } = useLocale();
  const { activeTab, setActiveTab } = useMovies();

  const tabs = [
    { key: "now_showing", label: translate("movies.now_showing") },
    { key: "coming_soon", label: translate("movies.coming_soon") },
  ];

  return <Tabs
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={
      (tab) => setActiveTab(tab as "now_showing" | "coming_soon")
    }
  />;
}
