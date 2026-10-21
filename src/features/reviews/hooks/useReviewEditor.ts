"use client";

import { useState } from "react";
import { REVIEW_MAX_LENGTH } from "../constants";
import type { UiReview } from "../types";

interface UseReviewEditorArgs {
  review: UiReview;
  onSave: (rating: number, text: string) => Promise<boolean>;
}

export interface ReviewEditor {
  isEditing: boolean;
  rating: number;
  hoveredRating: number;
  text: string;
  remaining: number;
  setText: (value: string) => void;
  setHoveredRating: (rating: number) => void;
  selectRating: (rating: number) => void;
  canSave: boolean;
  start: () => void;
  cancel: () => void;
  save: () => Promise<void>;
}

/**
 * Inline edit state for one review card. Cancel restores the persisted values,
 * so a second edit never reopens with the abandoned draft.
 */
export function useReviewEditor({ review, onSave }: UseReviewEditorArgs): ReviewEditor {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState(review.text);

  const trimmedText = text.trim();
  const canSave = rating > 0 && trimmedText.length > 0;

  return {
    isEditing,
    rating,
    hoveredRating,
    text,
    remaining: REVIEW_MAX_LENGTH - text.length,
    setText: (value: string) => setText(value.slice(0, REVIEW_MAX_LENGTH)),
    setHoveredRating,
    selectRating: setRating,
    canSave,
    start: () => setIsEditing(true),
    cancel: () => {
      setRating(review.rating);
      setText(review.text);
      setIsEditing(false);
    },
    save: async () => {
      if (!canSave) return;
      const isSaved = await onSave(rating, trimmedText);
      if (isSaved) setIsEditing(false);
    },
  };
}
