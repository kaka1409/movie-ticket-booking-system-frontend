"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { Movie } from "@/features/movies/types";

interface StatusContextType {
  slug: string;
  transactionId: string;
  reason: string | null;
  movie: Movie | undefined;
  mounted: boolean;
}

const StatusContext = createContext<StatusContextType | null>(null);

export function StatusProvider({
  allMovies,
  children,
}: {
  allMovies: Movie[];
  children: ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const transactionId = searchParams.get("transactionId") ?? "N/A";
  const reason = searchParams.get("reason");
  const movie = allMovies.find((m) => m.slug === slug);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <StatusContext.Provider
      value={{ slug, transactionId, reason, movie, mounted }}
    >
      {children}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error("useStatus must be used within StatusProvider");
  return ctx;
}
