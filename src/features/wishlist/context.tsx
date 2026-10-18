"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import { addWishlist, removeWishlist } from "@/features/wishlist/api";

/** Pre-translated toast messages for a toggle — built by the caller so each call site picks the messages it needs. */
export interface WishlistFeedback {
  added: string;
  addFailed: string;
  removeFailed: string;
  /** Success message for a removal — only pass where there is no Undo snackbar. */
  removed?: string;
}

interface WishlistContextType {
  wishlist: string[];
  /**
   * Single choke point for every heart: optimistic local toggle first, then
   * BE sync when logged in (rollback on real failures) with toast feedback.
   * Logged-out toggles stay local-only and are mirrored to localStorage.
   */
  toggleWishlist: (id: string, feedback?: WishlistFeedback) => void;
  isWishlisted: (id: string) => boolean;
  /** Merge server ids on top of local ones (server newest-first wins, local-only extras kept). */
  hydrateWishlist: (ids: string[]) => void;
}

const STORAGE_KEY = "wishlist";

const WishlistContext = createContext<WishlistContextType | null>(null);

function readStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const { notify } = useToast();
  const { locale } = useLocale();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Mount-only restore of logged-out picks. Intentionally two-pass: first paint
  // renders the SSR-identical empty draft (no hydration mismatch — localStorage
  // has no server equivalent), then stored ids merge in. A server hydration
  // that already ran keeps its order.
  useEffect(() => {
    const stored = readStoredWishlist();
    if (stored.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWishlist((prev) => [...prev, ...stored.filter((id) => !prev.includes(id))]);
    }
  }, []);

  // Mirror every change so logged-out picks survive refreshes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Storage full/disabled — the in-memory draft still works for the session.
    }
  }, [wishlist]);

  const toggleWishlist = useCallback(
    (id: string, feedback?: WishlistFeedback) => {
      const wasLiked = wishlist.includes(id);
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      if (!token) return;

      if (!wasLiked) {
        void addWishlist(id, token, locale).then((result) => {
          if ("error" in result && result.error.code !== "ALREADY_WISHLISTED") {
            setWishlist((prev) => prev.filter((entry) => entry !== id));
            if (feedback) notify(feedback.addFailed, { variant: "error" });
          } else if (feedback) {
            notify(feedback.added);
          }
        });
      } else {
        void removeWishlist(id, token).then((result) => {
          if ("error" in result && result.error.code !== "NOT_FOUND") {
            setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
            if (feedback) notify(feedback.removeFailed, { variant: "error" });
          } else if (feedback?.removed) {
            notify(feedback.removed);
          }
        });
      }
    },
    [wishlist, token, notify, locale],
  );

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const hydrateWishlist = useCallback((ids: string[]) => {
    setWishlist((prev) => [...ids, ...prev.filter((id) => !ids.includes(id))]);
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, hydrateWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
