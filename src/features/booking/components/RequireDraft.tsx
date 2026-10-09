"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context";

/**
 * Guard for draft-dependent steps (credentials, payment): a cold deep link
 * or hard refresh arrives with an empty draft, so the visitor is sent back to
 * step 1 instead of an unfillable form. The check also enforces that the
 * draft's movie matches the URL slug. Renders nothing while the redirect is
 * in flight (client navigation sees a live draft and paints immediately).
 */
export default function RequireDraft({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const { movie, showtimeId } = useBooking();
  const router = useRouter();
  const isDraftReady = Boolean(movie && movie.slug === slug && showtimeId);

  useEffect(() => {
    if (!isDraftReady) router.replace(`/booking/${slug}/cinema`);
  }, [isDraftReady, slug, router]);

  if (!isDraftReady) return null;
  return <>{children}</>;
}
