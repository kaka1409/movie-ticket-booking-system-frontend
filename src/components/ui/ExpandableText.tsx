"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

/** Above this length the text collapses to 3 lines with a Show more toggle. */
const EXPAND_THRESHOLD = 160;

/**
 * Review body with Show more / Show less for long text. Short text renders
 * as-is with no toggle; each card holds its own expanded state.
 */
export default function ExpandableText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { translate } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= EXPAND_THRESHOLD) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div>
      <p className={`${className} ${isExpanded ? "" : "line-clamp-3"}`}>{text}</p>
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        className="mt-1 text-xs font-bold text-(--color-gold)"
      >
        {isExpanded ? translate("common.show_less") : translate("common.show_more")}
      </button>
    </div>
  );
}
