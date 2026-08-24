"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTickets } from "@/features/tickets/context";
import Tabs from "@/components/ui/Tabs";

export default function TabsComponent() {
  const { translate } = useLocale();
  const { activeTab, setActiveTab } = useTickets();

  const tabs = [
    { key: "upcoming", label: translate("tickets.upcoming") },
    { key: "past", label: translate("tickets.past") },
  ];

  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as "upcoming" | "past")} />;
}
