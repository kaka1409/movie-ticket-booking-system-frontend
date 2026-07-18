"use client";

import { useLocale } from "@/contexts/LocaleContext";

const FOR_YOU = [
  { id: 1, title: "Gravity Wells",     reason: "Because you watched Interstellar",  gradient: "linear-gradient(160deg,#1a1000 0%,#3d2800 50%,#0d0800 100%)" },
  { id: 2, title: "City of Shadows",   reason: "Similar to The Batman",             gradient: "linear-gradient(160deg,#100808 0%,#2a0a0a 50%,#0a0404 100%)" },
  { id: 3, title: "Lunar Base 9",      reason: "New release in Sci-Fi",             gradient: "linear-gradient(160deg,#000a1a 0%,#001833 50%,#000508 100%)" },
  { id: 4, title: "Midnight Protocol",  reason: "Popular among Gold Members",        gradient: "linear-gradient(160deg,#080010 0%,#150025 50%,#040008 100%)" },
  { id: 5, title: "Digital Souls",      reason: "Recommended for you",              gradient: "linear-gradient(160deg,#001010 0%,#002a2a 50%,#000808 100%)" },
];

export default function ForYou() {
  const { translate } = useLocale();

  return (
    <section
      className="mt-12 py-14"
      style={{
        background: "linear-gradient(180deg,transparent 0%,rgba(255,204,77,0.03) 50%,transparent 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-1.5 text-[28px] font-black tracking-tight text-white">{translate("home.desktop.for_you")}, ALEX</h2>
          <p className="text-[13px] text-(--color-text-muted)">
            Based on your love for Space Adventures &amp; Thrillers
          </p>
        </div>
        <div className="grid grid-cols-5 gap-3.5">
          {FOR_YOU.map((item) => (
            <article key={item.id} className="cursor-pointer">
              <div
                className="mb-2.5 flex aspect-[2/3] w-full items-end overflow-hidden rounded-(--radius-md) border border-white/5 p-2.5 transition-transform"
                style={{ background: item.gradient }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <span className="text-sm font-extrabold uppercase tracking-tight text-white/20">
                  {item.title.split(" ")[0]}
                </span>
              </div>
              <h3 className="mb-0.5 text-[13px] font-bold text-white">{item.title}</h3>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">
                {item.reason}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
