"use client";

import { useLocale } from "@/contexts/LocaleContext";
import Tabs from "@/components/ui/Tabs";

/**
 * Tab bar — links, not state. Switching tabs navigates (`?tab=`, page reset
 * to 1) so the newly visible list is a fresh server fetch with its skeleton.
 * `activeTab` comes from the page's searchParams, not client state.
 */
export default function TabsComponent({ activeTab }: { activeTab: "upcoming" | "past" }) {
  const { translate } = useLocale();

  const tabs = [
    { key: "upcoming", label: translate("tickets.upcoming") },
    { key: "past", label: translate("tickets.past") },
  ];

  return (
    <div className="px-4">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        ariaLabel={translate("aria.tickets_tabs")}
        linkFor={(key) => `/tickets?tab=${key}`}
      />
    </div>
  );
}
