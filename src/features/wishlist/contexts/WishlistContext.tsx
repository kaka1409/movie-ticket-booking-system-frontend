"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
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

/**
 * localStorage is shared by every account on this browser, so picks are stored
 * under the signed-in user's id (`null` = signed-out draft). Without the owner
 * tag, account B would inherit account A's hearts after a logout/login.
 */
interface StoredWishlist {
  owner: string | null;
  ids: string[];
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function isIdList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === "string");
}

function readStoredWishlist(owner: string | null): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    // Legacy entries were a bare id array — they predate owner tagging, so only
    // a signed-out visitor may claim them (a logged-in account hydrates from
    // the server anyway and must not inherit a stranger's draft).
    if (isIdList(parsed)) return owner === null ? parsed : [];
    if (parsed && typeof parsed === "object" && "ids" in parsed) {
      const entry = parsed as StoredWishlist;
      return entry.owner === owner && isIdList(entry.ids) ? entry.ids : [];
    }
    return [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const { notify } = useToast();
  const { locale } = useLocale();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const ownerId = user?.id ?? null;
  const restoredRef = useRef(false);
  const lastOwnerRef = useRef<string | null | undefined>(undefined);

  // Mount-only restore of the CURRENT identity's picks, deferred until the
  // session resolves: reading earlier would tag the wrong owner. Two-pass like
  // before — first paint stays SSR-identical, stored ids merge in after.
  useEffect(() => {
    if (isAuthLoading || restoredRef.current) return;
    restoredRef.current = true;
    const stored = readStoredWishlist(ownerId);
    if (stored.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWishlist((previous) => [...previous, ...stored.filter((id) => !previous.includes(id))]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore runs once when auth settles
  }, [isAuthLoading]);

  // An account switch (login, logout, different user) invalidates every local
  // pick — they belonged to the previous identity's bucket.
  useEffect(() => {
    if (isAuthLoading) return;
    if (lastOwnerRef.current === undefined) {
      lastOwnerRef.current = ownerId;
      return;
    }
    if (lastOwnerRef.current === ownerId) return;
    lastOwnerRef.current = ownerId;
     
    setWishlist([]);
  }, [ownerId, isAuthLoading]);

  // Mirror every change under the current owner so picks survive refreshes
  // without leaking across accounts.
  useEffect(() => {
    if (isAuthLoading) return;
    try {
      const entry: StoredWishlist = { owner: ownerId, ids: wishlist };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // Storage full/disabled — the in-memory draft still works for the session.
    }
  }, [wishlist, ownerId, isAuthLoading]);

  const toggleWishlist = useCallback(
    (id: string, feedback?: WishlistFeedback) => {
      const wasLiked = wishlist.includes(id);
      setWishlist((previous) =>
        previous.includes(id) ? previous.filter((movieId) => movieId !== id) : [...previous, id],
      );
      if (!token) return;

      if (!wasLiked) {
        void addWishlist(id, token, locale).then((result) => {
          if ("error" in result && result.error.code !== "ALREADY_WISHLISTED") {
            setWishlist((previous) => previous.filter((entry) => entry !== id));
            if (feedback) notify(feedback.addFailed, { variant: "error" });
          } else if (feedback) {
            notify(feedback.added);
          }
        });
      } else {
        void removeWishlist(id, token).then((result) => {
          if ("error" in result && result.error.code !== "NOT_FOUND") {
            setWishlist((previous) => (previous.includes(id) ? previous : [...previous, id]));
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
    setWishlist((previous) => [...ids, ...previous.filter((id) => !ids.includes(id))]);
  }, []);

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, isWishlisted, hydrateWishlist }),
    [wishlist, toggleWishlist, isWishlisted, hydrateWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
