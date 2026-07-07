"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import { CINEMAS, DATES, INITIAL_CINEMAS_VISIBLE } from "../shared/mock";

export default function Showtimes() {
  // Date section's states
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selected, setSelected] = useState<{
    cinemaId: number;
    time: string;
  } | null>(null);

  // Cinema section's states
  const [showAll, setShowAll] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [maxH, setMaxH] = useState<string>("none");
  
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldShowAll = showAll || isCollapsing;
  const visibleCinemas = shouldShowAll
    ? CINEMAS
    : CINEMAS.slice(0, INITIAL_CINEMAS_VISIBLE);
  const hasMore = CINEMAS.length > INITIAL_CINEMAS_VISIBLE;

  useEffect(() => {
    if (!containerRef.current) return;

    if (isCollapsing) {
      const cards = containerRef.current.children;
      let collapsedHeight = 0;
      const count = Math.min(INITIAL_CINEMAS_VISIBLE, cards.length);

      // Get collapse height by counting height of each card
      for (let i = 0; i < count; i++) {
        const card = cards[i] as HTMLElement
        collapsedHeight += card.getBoundingClientRect().height;
      }
      
      collapsedHeight += (count - 1) * 16;
      setMaxH(collapsedHeight + "px");
      
    } else setMaxH(containerRef.current.scrollHeight + "px");
    
  }, [showAll, isCollapsing]);

  useEffect(() => {
    if (!isCollapsing) return;
    
    const timer = setTimeout(() => {
      setShowAll(false);
      setIsCollapsing(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isCollapsing]);

  const toggleShowAll = () => {
    if (showAll) setIsCollapsing(true);
    else setShowAll(true);
  };

  const selectTime = (cinemaId: number, time: string) => {
    setSelected({ cinemaId, time });
  };

  return (
    <section className="px-4">
      <SectionHeading>Showtimes</SectionHeading>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {DATES.map((date) => {
          const active = selectedDate === date.value;
          return (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`
                shrink-0 flex flex-col items-center justify-center
                w-14 rounded-xl py-2 border transition-all duration-150
                ${
                  active
                    ? "bg-(--color-gold) border-(--color-gold) shadow-[0_0_12px_rgba(255,204,77,0.3)]"
                    : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/40"
                }
              `}
              aria-pressed={active}
            >
              <span
                className={`text-[9px] font-bold tracking-widest ${
                  active ? "text-(--color-bg)" : "text-(--color-text-muted)"
                }`}
              >
                {date.label}
              </span>
              <span
                className={`text-xl font-extrabold leading-tight ${
                  active
                    ? "text-(--color-bg)"
                    : "text-(--color-text-primary)"
                }`}
              >
                {date.day}
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        style={{ maxHeight: maxH }}
        className="animate-expand space-y-4"
      >
        {visibleCinemas.map((cinema, index) => (
            <div
              key={cinema.id}
              className="animate-fade-in rounded-2xl bg-(--color-surface) border border-(--color-border) p-4"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-(--color-text-primary) font-bold text-sm">
                    {cinema.name}
                  </p>
                  <p className="text-(--color-text-muted) text-xs mt-0.5">
                    {cinema.location}
                  </p>
                  <p className="flex items-center gap-1 text-(--color-text-muted) text-xs mt-0.5">
                    <MapPin size={11} /> {cinema.distance}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md ${cinema.badgeColor}`}
                >
                  {cinema.badge}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {cinema.times.map((t) => {
                  const active =
                    selected?.cinemaId === cinema.id && selected?.time === t;
                  return (
                    <button
                      key={t}
                      onClick={() => selectTime(cinema.id, t)}
                      className={`
                        px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150
                        ${
                          active
                            ? "bg-(--color-gold) border-(--color-gold) text-(--color-bg) shadow-[0_0_10px_rgba(255,204,77,0.25)]"
                            : "bg-(--color-surface-2) border-(--color-border) text-(--color-text-primary) hover:border-(--color-gold)/40"
                        }
                      `}
                      aria-pressed={active}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {hasMore && (
        <button
          onClick={toggleShowAll}
          className="w-full mt-4 py-3 rounded-2xl border border-(--color-border) text-(--color-gold) font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-1 hover:bg-(--color-surface) transition-colors"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Load More Cinemas <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </section>
  );
}
