"use client";

import { Minus, Plus } from "lucide-react";

export default function Stepper({
  value,
  onDecrement,
  onIncrement,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-(--color-surface-2) rounded-xl px-1 py-1">
      <button
        onClick={onDecrement}
        disabled={value === 0}
        aria-label="Decrease quantity"
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed bg-(--color-border) text-(--color-text-secondary) hover:bg-(--color-gold)/20 hover:text-(--color-gold)"
      >
        <Minus size={14} />
      </button>

      <span className="w-5 text-center font-bold text-sm text-(--color-text-primary) tabular-nums">
        {value}
      </span>

      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 bg-(--color-border) text-(--color-text-secondary) hover:bg-(--color-gold)/20 hover:text-(--color-gold)"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
