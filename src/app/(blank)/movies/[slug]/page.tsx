"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Play,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Calendar,
  Ticket,
  Pencil,
  Trash2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════ */

const MOVIE = {
  title: "Avengers",
  poster: "https://i.ebayimg.com/images/g/wy8AAOSwGMFcv5s2/s-l1200.jpg",
  rating: 8.8,
  genre: "Sci-Fi",
  duration: "166 min",
  rating_label: "PG-13",
  synopsis:
    "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
};

const CAST = [
  { name: "Downey JR", role: "Iron Man", initials: "RD" },
  { name: "Downey Jr", role: "Iron man", initials: "RD" },
  { name: "Chirs Evans", role: "Captain America", initials: "CE" },
  { name: "Mark Ruffalo", role: "The Hulk", initials: "MR" },
];

const DATES = [
  { label: "MAY", day: "12", value: "2024-05-12" },
  { label: "MAY", day: "13", value: "2024-05-13" },
  { label: "MAY", day: "14", value: "2024-05-14" },
  { label: "MAY", day: "15", value: "2024-05-15" },
];

const CINEMAS = [
  {
    id: 1,
    name: "AMC Empire 25",
    distance: "2.1 mi away",
    badge: "IMAX 70MM",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    times: ["11:30 AM", "2:45 PM", "6:15 PM", "9:30 PM"],
  },
  {
    id: 2,
    name: "Regal Union Square",
    distance: "3.4 mi away",
    badge: "STANDARD",
    badgeColor: "bg-(--color-border) text-(--color-text-secondary)",
    times: ["12:15 PM", "3:30 PM", "7:00 PM", "10:15 PM"],
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 1 },
];

const REVIEWS = [
  {
    id: 1,
    user: "Alex M.",
    initials: "AM",
    rating: 5,
    time: "2 days ago",
    text: "A visual masterpiece. Denis Villeneuve has created something truly spectacular. The sound design alone is worth experiencing in IMAX. Absolutely blew me away.",
  },
  {
    id: 2,
    user: "Sarah K.",
    initials: "SK",
    rating: 4,
    time: "1 week ago",
    text: "Great continuation of the story. The pacing was a bit slow in the middle, but the climax more than made up for it. Austin Butler was terrifying.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

function Stars({
  rating,
  max = 5,
  size = 14,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "text-(--color-gold) fill-(--color-gold)"
              : "text-(--color-border) fill-(--color-border)"
          }
        />
      ))}
    </span>
  );
}

function Avatar({
  initials,
  size = "w-11 h-11",
}: {
  initials: string;
  size?: string;
}) {
  return (
    <div
      className={`${size} rounded-full bg-(--color-border) flex items-center justify-center shrink-0`}
    >
      <span className="text-(--color-gold) text-xs font-bold">{initials}</span>
    </div>
  );
}

function SectionHeading({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-(--color-text-primary) font-bold text-base flex items-center gap-2">
        <span className="inline-block w-1 h-5 rounded-full bg-(--color-gold)" />
        {children}
      </h2>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative w-full h-[280px]">
      <Image
        src={MOVIE.poster}
        alt={MOVIE.title}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-(--color-bg)" />

      {/*Play button*/}
      <button
        className="absolute inset-0 flex items-center justify-center group"
        aria-label="Watch trailer"
      >
        <div
          className="
            w-14 h-14 rounded-full backdrop-blur-xs bg-(--color-gold)/20 border border-(--color-gold) flex items-center justify-center 
            shadow-lg group-hover:scale-110 transition-transform duration-200
          "
        >
          <Play
            size={18}
            className="text-(--color-gold)"
          />
        </div>
      </button>

      {/*Header overlay*/}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-5">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-(--color-gold-light)" />
        </Link>

        <Link
          href="/notifications"
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
          aria-label="Notify me"
        >
          <Bell size={18} className="text-(--color-gold-light)" />
        </Link>
      </div>

      {/*Mini poster*/}
      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 px-4">
        <div
          className="w-20 h-28 rounded-xl shrink-0 border border-(--color-border) overflow-hidden"
        >
          <Image
            src={MOVIE.poster}
            alt={MOVIE.title}
            width={200}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 pb-1">
          <h1 className="text-(--color-text-primary) text-2xl font-extrabold leading-tight mb-1">
            {MOVIE.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-(--color-gold) text-xs font-bold">
              <Star size={11} className="fill-(--color-gold)" />
              {MOVIE.rating}/10
            </span>
            <span className="text-(--color-text-muted) text-xs">•</span>
            <span className="text-(--color-gold-light) text-xs">
              {MOVIE.genre}
            </span>
            <span className="text-(--color-text-muted) text-xs">•</span>
            <span className="flex items-center gap-1 text-(--color-text-secondary) text-xs">
              <Clock size={11} />
              {MOVIE.duration}
            </span>
          </div>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold border border-(--color-border) text-(--color-text-secondary)">
            {MOVIE.rating_label}
          </span>
        </div>
      </div>
      
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SYNOPSIS
═══════════════════════════════════════════════════════════════ */

function Synopsis() {
  const [expanded, setExpanded] = useState(false);
  const SHORT_LIMIT = 160;
  const isLong = MOVIE.synopsis.length > SHORT_LIMIT;
  const displayText =
    !isLong || expanded
      ? MOVIE.synopsis
      : MOVIE.synopsis.slice(0, SHORT_LIMIT) + "…";

  return (
    <section className="px-4">
      <SectionHeading>Synopsis</SectionHeading>
      <p className="text-(--color-text-secondary) text-sm leading-relaxed">
        {displayText}
        {isLong && (
          <button
            className="text-(--color-gold) font-bold ml-1 hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </p>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOP CAST
═══════════════════════════════════════════════════════════════ */

function TopCast() {
  return (
    <section className="px-4">
      <SectionHeading
        // action={
        //   <button className="flex items-center gap-1 text-(--color-gold) text-xs font-bold">
        //     SEE ALL <ChevronRight size={14} />
        //   </button>
        // }
      >
        Top Cast
      </SectionHeading>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
        {CAST.map((actor) => (
          <div
            key={actor.name}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-(--color-surface) border border-(--color-border) overflow-hidden flex items-center justify-center">
              <span className="text-(--color-gold) text-sm font-bold">
                {actor.initials}
              </span>
            </div>
            <p className="text-(--color-text-primary) text-xs font-semibold text-center leading-tight">
              {actor.name}
            </p>
            <p className="text-(--color-text-muted) text-[10px] text-center">
              {actor.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHOWTIMES
═══════════════════════════════════════════════════════════════ */

function Showtimes() {
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedTimes, setSelectedTimes] = useState<Record<number, string>>({
    1: "6:15 PM",
  });

  const toggleTime = (cinemaId: number, time: string) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [cinemaId]: prev[cinemaId] === time ? "" : time,
    }));
  };

  return (
    <section className="px-4">
      <SectionHeading>Showtimes</SectionHeading>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {DATES.map((d) => {
          const active = selectedDate === d.value;
          return (
            <button
              key={d.value}
              onClick={() => setSelectedDate(d.value)}
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
                  active
                    ? "text-(--color-bg)"
                    : "text-(--color-text-muted)"
                }`}
              >
                {d.label}
              </span>
              <span
                className={`text-xl font-extrabold leading-tight ${
                  active
                    ? "text-(--color-bg)"
                    : "text-(--color-text-primary)"
                }`}
              >
                {d.day}
              </span>
            </button>
          );
        })}

        <button className="shrink-0 w-14 rounded-xl border border-(--color-border) bg-(--color-surface) flex items-center justify-center hover:border-(--color-gold)/40 transition-colors">
          <Calendar size={18} className="text-(--color-text-muted)" />
        </button>
      </div>

      <div className="space-y-4">
        {CINEMAS.map((cinema) => (
          <div
            key={cinema.id}
            className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-(--color-text-primary) font-bold text-sm">
                  {cinema.name}
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
                const active = selectedTimes[cinema.id] === t;
                return (
                  <button
                    key={t}
                    onClick={() => toggleTime(cinema.id, t)}
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
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOK TICKET CTA
═══════════════════════════════════════════════════════════════ */

function BookTicketCTA() {
  return (
    <div className="px-4">
      <button className="w-full py-4 rounded-2xl bg-(--color-gold) text-(--color-bg) font-extrabold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-(--color-gold-dark) active:scale-[0.98] transition-all duration-150 shadow-[0_0_24px_rgba(255,204,77,0.3)]">
        <Ticket size={18} className="fill-(--color-bg)" />
        Book Ticket
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REVIEWS
═══════════════════════════════════════════════════════════════ */

function RatingBar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-(--color-text-muted) text-xs w-2 text-right">
        {stars}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-(--color-border) overflow-hidden">
        <div
          className="h-full rounded-full bg-(--color-gold)"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WriteReview() {
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4 space-y-3">
      <p className="text-(--color-text-primary) font-bold text-sm">
        Write a Review
      </p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setUserRating(s)}
            aria-label={`Rate ${s} stars`}
          >
            <Star
              size={22}
              className={
                s <= (hovered || userRating)
                  ? "text-(--color-gold) fill-(--color-gold)"
                  : "text-(--color-border) fill-(--color-border)"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts about the movie..."
        rows={3}
        className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-sm text-(--color-text-secondary) placeholder-(--color-text-muted) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
      />

      <button
        disabled={!userRating || !text.trim()}
        className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        Post Review
      </button>
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <div className="py-4 border-b border-(--color-border) last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar initials={review.initials} size="w-9 h-9" />
          <div>
            <p className="text-(--color-text-primary) text-sm font-bold leading-tight">
              {review.user}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Stars rating={review.rating} size={11} />
              <span className="text-(--color-text-muted) text-[10px]">
                {review.time}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Edit review">
            <Pencil
              size={14}
              className="text-(--color-text-muted) hover:text-(--color-gold) transition-colors"
            />
          </button>
          <button aria-label="Delete review">
            <Trash2
              size={14}
              className="text-(--color-text-muted) hover:text-red-400 transition-colors"
            />
          </button>
        </div>
      </div>

      <p className="text-(--color-text-secondary) text-sm leading-relaxed pl-11">
        {review.text}
      </p>
    </div>
  );
}

function Reviews() {
  return (
    <section className="px-4 space-y-4">
      <SectionHeading>Reviews</SectionHeading>

      <div className="flex items-center gap-5 py-1">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-extrabold text-(--color-gold) leading-none">
            4.8
          </span>
          <Stars rating={4.8} size={13} />
          <span className="text-(--color-text-muted) text-[10px] mt-0.5">
            2.4k ratings
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          {RATING_BREAKDOWN.map((r) => (
            <RatingBar key={r.stars} stars={r.stars} pct={r.pct} />
          ))}
        </div>
      </div>

      <WriteReview />

      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 divide-y divide-(--color-border)">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <button className="w-full py-3 rounded-2xl border border-(--color-border) text-(--color-gold) font-bold text-sm tracking-widest uppercase hover:bg-(--color-surface) transition-colors">
        Load More Reviews
      </button>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */

export default function MovieDetailPage() {
  return (
    <div className="min-h-dvh bg-(--color-bg) max-w-md mx-auto flex flex-col">
      <HeroSection />

      <div className="flex flex-col gap-8 py-6 pb-12">
        <Synopsis />
        <TopCast />
        <Showtimes />
        <BookTicketCTA />
        <Reviews />
      </div>
    </div>
  );
}
