"use client";

/**
 * Double-thumb range slider built from two native `<input type="range">`
 * elements stacked on one track — no extra dependency, so keyboard, screen
 * reader and touch behaviour stay the browser's. The inputs are
 * `pointer-events-none` and only their thumbs accept the pointer (see the
 * `.range-slider-thumb` rules in `styles/global.css`), which is what lets each
 * knob be dragged independently even though the inputs overlap.
 *
 * Presentation only: the caller owns the values and decides how a bound maps
 * back to its own state (the movies panel treats the two edges as "unbounded").
 * A knob is never allowed to cross the other one.
 */
interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onValueMinChange: (value: number) => void;
  onValueMaxChange: (value: number) => void;
  /** Accessible name of the lower thumb. */
  labelMin: string;
  /** Accessible name of the upper thumb. */
  labelMax: string;
  className?: string;
}

const THUMB_INPUT_CLASS =
  "range-slider-thumb pointer-events-none absolute inset-x-0 h-6 w-full appearance-none bg-transparent";

export default function RangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onValueMinChange,
  onValueMaxChange,
  labelMin,
  labelMax,
  className,
}: RangeSliderProps) {
  const span = max - min || 1;
  const minPercent = ((valueMin - min) / span) * 100;
  const maxPercent = ((valueMax - min) / span) * 100;

  /* The inputs overlap, so whichever knob sits in the right half is raised:
     a pair parked at the top edge stays grabbable instead of deadlocking. */
  const isMinThumbOnTop = minPercent > 50;

  return (
    <div className={`relative flex h-6 w-full items-center ${className ?? ""}`}>
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-(--color-border)" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-(--color-gold)"
        style={{ left: `${minPercent}%`, width: `${Math.max(maxPercent - minPercent, 0)}%` }}
      />

      <input
        type="range"
        name="range-min"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(event) => onValueMinChange(Math.min(Number(event.target.value), valueMax))}
        aria-label={labelMin}
        style={{ zIndex: isMinThumbOnTop ? 4 : 3 }}
        className={THUMB_INPUT_CLASS}
      />
      <input
        type="range"
        name="range-max"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(event) => onValueMaxChange(Math.max(Number(event.target.value), valueMin))}
        aria-label={labelMax}
        style={{ zIndex: isMinThumbOnTop ? 3 : 4 }}
        className={THUMB_INPUT_CLASS}
      />
    </div>
  );
}
