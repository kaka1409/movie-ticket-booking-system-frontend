"use client";

import { useEffect, useState } from "react";

/** How long the deep-link gold ring stays before clearing itself. */
const HIGHLIGHT_MS = 4000;

function readHashReviewId(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#review-([A-Za-z0-9-]+)$/);
  return match ? match[1] : null;
}

/**
 * Deep-link highlight for `#review-<id>` (profile "View review" buttons).
 * Returns the id to ring once it is on the current page; auto-advances pages
 * (bounded by `totalPages`) until the review shows up. A deleted/unknown id
 * simply stops at the last page with nothing highlighted. Mount reads the URL
 * in an effect (not a lazy initializer) so the first paint stays
 * SSR-identical — the hash has no server equivalent.
 */
export function useReviewHighlight({
  reviewIds,
  page,
  totalPages,
  loadingPage,
  goToPage,
}: {
  reviewIds: string[];
  page: number;
  totalPages: number;
  loadingPage: boolean;
  goToPage: (page: number) => void;
}): string | null {
  const [targetId, setTargetId] = useState<string | null>(null);

  useEffect(() => {
    const applyHash = () => setTargetId(readHashReviewId());
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
    // Mount-only URL adoption — the hash is an external system, and reading it
    // here (instead of a lazy initializer) keeps hydration mismatch-free.
  }, []);

  const highlightedId = targetId && reviewIds.includes(targetId) ? targetId : null;

  // Scroll + self-clear once the target is on screen.
  useEffect(() => {
    if (!highlightedId) return;
    document
      .getElementById(`review-${highlightedId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setTargetId(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  // Page hunt: walk forward until the target appears or pages run out.
  useEffect(() => {
    if (!targetId || highlightedId || page >= totalPages || loadingPage) return;
    goToPage(page + 1);
  }, [targetId, highlightedId, page, totalPages, loadingPage, goToPage]);

  return highlightedId;
}
