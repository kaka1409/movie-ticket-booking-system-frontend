"use client";

import { useState } from "react";
import { REVIEW_MAX_LENGTH } from "../constants";

interface UseReviewComposerArgs {
  onSubmit: (rating: number, text: string) => Promise<boolean>;
  disabled?: boolean;
}

export interface ReviewComposer {
  rating: number;
  /** Star currently under the cursor, so a hover previews without committing. */
  hoveredRating: number;
  text: string;
  remaining: number;
  setText: (value: string) => void;
  setHoveredRating: (rating: number) => void;
  selectRating: (rating: number) => void;
  canSubmit: boolean;
  submit: () => Promise<void>;
}

/**
 * Draft state behind both `WriteReview` skins. The body is clipped to
 * `REVIEW_MAX_LENGTH` on every keystroke — the backend rejects longer text, so
 * an over-typed review must never reach the submit button.
 */
export function useReviewComposer({ onSubmit, disabled }: UseReviewComposerArgs): ReviewComposer {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");

  const trimmedText = text.trim();
  const canSubmit = !disabled && rating > 0 && trimmedText.length > 0;

  return {
    rating,
    hoveredRating,
    text,
    remaining: REVIEW_MAX_LENGTH - text.length,
    setText: (value: string) => setText(value.slice(0, REVIEW_MAX_LENGTH)),
    setHoveredRating,
    selectRating: setRating,
    canSubmit,
    submit: async () => {
      if (!canSubmit) return;
      const isSubmitted = await onSubmit(rating, trimmedText);
      if (!isSubmitted) return;
      // A posted review empties the composer; a failed one keeps the draft.
      setRating(0);
      setText("");
    },
  };
}
