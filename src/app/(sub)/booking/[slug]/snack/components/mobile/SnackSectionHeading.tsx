"use client";

import { useLocale } from "@/contexts/LocaleContext";
import SectionHeader from "@/components/ui/SectionHeader";

export default function SnackSectionHeading({ sectionKey }: { sectionKey: string }) {
  const { translate } = useLocale();
  return <SectionHeader variant="uppercase">{translate(sectionKey)}</SectionHeader>;
}
