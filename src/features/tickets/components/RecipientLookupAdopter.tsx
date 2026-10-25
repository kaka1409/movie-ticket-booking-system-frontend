"use client";

import { useEffect, useRef } from "react";
import { getRecipient } from "../api";
import { useTransfer } from "../contexts/TransferContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { isValidEmail } from "@/libs/zod";

/**
 * Effect-only mount helper for the transfer step (renders nothing): resolves the
 * typed email into a recipient and adopts it into the draft. Mounted at PAGE
 * level — both device trees render, so a per-skin mount would run the lookup
 * twice and an idle twin would clear the other one's result.
 *
 * An exact address triggers `GET /user/search`, which answers with a single user
 * or none; the recipient is adopted only when found, so the CTA stays disabled
 * otherwise.
 */
export default function RecipientLookupAdopter() {
  const { query, setRecipient, setIsRecipientMissing } = useTransfer();
  const { token } = useAuth();
  const debouncedQuery = useDebouncedValue(query);
  const requestSequenceRef = useRef(0);

  useEffect(() => {
    const email = debouncedQuery.trim();
    const canSearch = isValidEmail(email);
    const requestSequence = ++requestSequenceRef.current;

    // All state transitions land in the promise callback (never synchronously in
    // the effect body), so a stale keystroke can't flash a stale result. The RAM
    // Bearer token authenticates the client call.
    const lookup = canSearch
      ? getRecipient(email, { token: token ?? undefined })
      : Promise.resolve(null);

    lookup
      .then((found) => {
        if (requestSequence !== requestSequenceRef.current) return;
        setRecipient(found);
        setIsRecipientMissing(canSearch && !found);
      })
      .catch(() => {
        if (requestSequence !== requestSequenceRef.current) return;
        setRecipient(null);
        setIsRecipientMissing(canSearch);
      });
  }, [debouncedQuery, setRecipient, setIsRecipientMissing, token]);

  return null;
}
