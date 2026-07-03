"use client";

import { Star, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[480px] w-full items-center overflow-hidden"
      style={{
        background: "linear-gradient(120deg,#06090f 0%,#0d1520 35%,#111820 65%,#080c12 100%)",
      }}
    >
      {[360, 260, 180].map((size, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute"
          style={{
            right: `${8 + i * 4}%`,
            top: "50%",
            transform: "translateY(-50%)",
            width: size,
            height: size,
            borderRadius: "50%",
            background:
              i === 0
                ? "radial-gradient(circle,rgba(255,204,77,0.12) 0%,rgba(255,140,0,0.06) 40%,transparent 70%)"
                : "transparent",
            border:
              i > 0
                ? `1px solid rgba(255,204,77,${i === 1 ? 0.12 : 0.07})`
                : "none",
            boxShadow: i === 0 ? "0 0 80px 20px rgba(255,204,77,0.05)" : "none",
          }}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right,rgba(6,9,15,0.98) 0%,rgba(6,9,15,0.8) 50%,transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-16">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="rounded-(--radius-sm) bg-(--color-gold) px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest uppercase text-black">
            Featured Today
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-(--color-gold)">
            <Star size={12} fill="currentColor" /> 8.9/10
          </span>
          <span className="text-[11px] text-(--color-text-muted)">•</span>
          <span className="text-xs text-(--color-text-secondary)">2h 49m</span>
          <span className="text-[11px] text-(--color-text-muted)">•</span>
          <span className="text-xs text-(--color-text-secondary)">Sci-Fi, Adventure</span>
        </div>

        <h1
          className="mb-4 font-black uppercase leading-[0.95] tracking-tight text-white"
          style={{ fontSize: "clamp(3rem,5.5vw,5rem)" }}
        >
          Interstellar
        </h1>

        <p className="mb-7 max-w-[440px] text-sm leading-relaxed text-white/55">
          Journey through the unknown reaches of the galaxy in this award-winning cinematic
          masterpiece that redefines the science fiction genre.
        </p>

        <div className="mb-7 flex gap-3">
          <button className="cursor-pointer rounded-(--radius-md) border-none bg-(--color-gold) px-7 py-3 text-[13px] font-extrabold tracking-wide text-black">
            Book Now
          </button>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-(--radius-md) border border-white/15 bg-white/8 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-sm">
            <Play size={14} fill="currentColor" /> Watch Trailer
          </button>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === 0 ? 20 : 6,
                background:
                  i === 0
                    ? "var(--color-gold)"
                    : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
