"use client";

import { useLocale } from "@/contexts/LocaleContext";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";
import type { ReactNode } from "react";

export default function ReviewsShell({ content }: { content: ReactNode }) {
  const { translate } = useLocale();
  return (
    <AccountShell
      title={translate("profile.review_rating")}
      description={translate("profile.pages.reviews_desc")}
    >
      {content}
    </AccountShell>
  );
}
