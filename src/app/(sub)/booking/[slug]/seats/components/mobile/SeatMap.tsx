"use client";

import { useRef, useState, useEffect } from "react";
import { useSeatSelection } from "./SeatSelectionContext";
import SeatCell from "./SeatCell";

export default function SeatMap() {
  const { rows, handleToggle } = useSeatSelection();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const naturalW = el.scrollWidth;
      const viewportW = window.innerWidth;
      const s = Math.min(viewportW / naturalW, 1);
      setScale(s);
      setContentHeight(el.scrollHeight * s);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center gap-1 mb-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-(--color-gold) uppercase">
          Screen
        </span>
        <svg width="300" height="24" viewBox="0 0 260 24" fill="none">
          <path
            d="M 4 20 Q 130 0 256 20"
            stroke="rgba(255,204,77,0.8)"
            strokeWidth="5"
          />
        </svg>
      </div>
      <div className="px-2 overflow-x-auto scrollbar-hide">
        <div
          ref={contentRef}
          className="inline-flex flex-col justify-center gap-2 w-full"
        >
  
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between items-center gap-2 w-full">
              <span className="w-5 text-center text-xs font-bold text-(--color-text-muted) shrink-0">
                {row.label}
              </span>
  
              <div className="flex gap-1.5">
                {row.segments[0].map((seat, si) => (
                  <SeatCell
                    key={`${row.label}-L-${si}`}
                    seat={seat}
                    onToggle={(s) => handleToggle(row.label, s)}
                  />
                ))}
              </div>
  
              <div className="w-3 shrink-0" />
  
              <div className="flex gap-1.5">
                {row.segments[1].map((seat, si) => (
                  <SeatCell
                    key={`${row.label}-R-${si}`}
                    seat={seat}
                    onToggle={(s) => handleToggle(row.label, s)}
                  />
                ))}
              </div>
  
              <span className="w-5 text-center text-xs font-bold text-(--color-text-muted) shrink-0">
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
