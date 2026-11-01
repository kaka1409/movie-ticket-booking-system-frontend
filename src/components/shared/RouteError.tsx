"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, ChevronDown, Copy, Home, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import StatusPageShell from "@/components/shared/StatusPageShell";
import RouteErrorArt from "@/components/shared/RouteErrorArt";

const GLITCH_CHARS = "!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Decode animation hook: cycles characters through random glyphs before settling
 * on their true values. The last settled character signals completion.
 */
function useGlitchDecode(target: string, duration = 2000) {
  const [chars, setChars] = useState(() =>
    target.split("").map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]),
  );
  const [isDone, setIsDone] = useState(false);
  const intervalsReference = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    const steps = target.length;
    const stepDuration = duration / steps;

    target.split("").forEach((targetChar, charIndex) => {
      let cycleCount = 0;
      const maxCycles = 7;
      const interval = setInterval(() => {
        cycleCount++;
        if (cycleCount >= maxCycles) {
          clearInterval(interval);
          setChars((previous) => {
            const next = [...previous];
            next[charIndex] = targetChar;
            return next;
          });
          if (charIndex === steps - 1) {
            setTimeout(() => setIsDone(true), 100);
          }
          return;
        }
        setChars((previous) => {
          const next = [...previous];
          next[charIndex] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          return next;
        });
      }, stepDuration / maxCycles);

      intervalsReference.current.push(interval);
    });

    return () => {
      intervalsReference.current.forEach(clearInterval);
      intervalsReference.current = [];
    };
  }, [target, duration]);

  const isDecoded = useCallback((index: number) => chars[index] === target[index], [chars, target]);

  return { chars, isDone, isDecoded };
}

/**
 * Animated glitch typography decoding into real characters.
 */
function GlitchText({
  text,
  className,
  onDone,
}: {
  text: string;
  className?: string;
  onDone?: () => void;
}) {
  const { chars, isDone, isDecoded } = useGlitchDecode(text, 2000);

  useEffect(() => {
    if (isDone) onDone?.();
  }, [isDone, onDone]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={
            !isDecoded(index)
              ? {
                  animation: "glitchDecode 0.3s ease infinite",
                  color: "var(--color-text-muted)",
                }
              : { color: "var(--color-gold)" }
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}

/**
 * Responsive RouteError screen:
 * - Mobile (< md): Container-less chrome-less vertical stack with glitch decode animation
 *   matching the original mobile experience.
 * - Tablet & Desktop (>= md): 50/50 split showcase container (`max-w-7xl`),
 *   infused with cinema alert red, interactive abstract art on the left, and actions +
 *   3 troubleshooting accordions on the right.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { translate } = useLocale();
  const [glitchDone, setGlitchDone] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleCopy = () => {
    if (!error?.digest) return;
    navigator.clipboard.writeText(error.digest);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleTroubleshoot = (index: number) => {
    setExpandedIndex((previous) => (previous === index ? null : index));
  };

  const troubleshootItems = [
    {
      id: "01",
      title: translate("error.troubleshoot_1_title"),
      description: translate("error.troubleshoot_1_desc"),
    },
    {
      id: "02",
      title: translate("error.troubleshoot_2_title"),
      description: translate("error.troubleshoot_2_desc"),
    },
    {
      id: "03",
      title: translate("error.troubleshoot_3_title"),
      description: translate("error.troubleshoot_3_desc"),
    },
  ];

  return (
    <StatusPageShell layout="centered">
      {/* ─── MOBILE VIEW (< md): Original Chrome-less Stack with Glitch Decode ─── */}
      <div className="flex w-full max-w-xs flex-col items-center text-center md:hidden">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-9 w-9 text-red-500" strokeWidth={2} />
        </div>

        <div className="mt-6 text-5xl font-black tracking-widest">
          <GlitchText text={translate("error.title")} onDone={() => setGlitchDone(true)} />
        </div>

        <p
          className={`mt-4 text-sm text-(--color-text-muted) transition duration-700 ${
            glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {translate("error.description")}
        </p>

        {error?.digest ? (
          <p
            className={`mt-3 font-mono text-2xs text-(--color-text-muted) transition duration-700 delay-100 ${
              glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {translate("error.ref")}:{" "}
            <span className="break-all text-(--color-text-primary)/70">#{error.digest}</span>
          </p>
        ) : null}

        <div
          className={`mt-8 flex w-full flex-col gap-3 transition duration-700 delay-200 ${
            glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button variant="primary" icon={RotateCcw} iconPosition="left" onClick={reset}>
            {translate("error.try_again")}
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" icon={Home} iconPosition="left" className="w-full">
              {translate("error.back_home")}
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── TABLET & DESKTOP VIEW (>= md): 50/50 Split Showcase (max-w-7xl) ─── */}
      <div className="surface-raised mx-auto hidden w-full max-w-7xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) md:block md:rounded-3xl">
        <div className="grid min-h-[580px] grid-cols-2 lg:min-h-[640px]">
          {/* Left Column (50%): Abstract Cinema Error Art (Red & Gold) */}
          <div className="border-r border-(--color-border)">
            <RouteErrorArt />
          </div>

          {/* Right Column (50%): Information & Red-Accented Troubleshooting Accordions */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-(--color-text-primary) sm:text-3xl lg:text-4xl">
                {translate("error.technical_glitch")}
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-(--color-text-muted)">
                {translate("error.description")}
              </p>

              {/* Reference Error Digest Box with Red Accent */}
              {error?.digest ? (
                <div className="mt-5 flex max-w-lg items-center justify-between rounded-xl border border-red-500/25 bg-red-500/5 px-3.5 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-3xs font-semibold tracking-wider text-red-400/90 uppercase">
                      {translate("error.ref")}
                    </span>
                    <span className="font-mono text-xs text-(--color-text-primary)/90 selection:bg-red-500/30">
                      {error.digest}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-2.5 py-1 text-xs font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-500/10"
                  >
                    {isCopied ? (
                      <>
                        <Check size={13} className="text-green-400" />
                        <span className="text-green-400">{translate("error.copied_ref")}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>{translate("error.copy_ref")}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : null}

              {/* Desktop-refined inline CTA pair with RotateCcw icon */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  icon={RotateCcw}
                  iconPosition="left"
                  onClick={reset}
                  fullWidth={false}
                  uppercase={false}
                  className="sm:min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-bold shadow-none"
                >
                  {translate("error.try_again")}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  href="/"
                  fullWidth={false}
                  uppercase={false}
                  className="sm:min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-bold"
                >
                  {translate("error.back_home")}
                </Button>
              </div>
            </div>

            {/* 3 Troubleshooting Accordions with Red Highlights */}
            <div className="mt-10 border-t border-(--color-border) pt-6">
              <p className="mb-3 text-2xs font-bold uppercase tracking-[0.2em] text-(--color-text-muted)">
                {translate("error.troubleshoot_heading")}
              </p>

              <div className="flex flex-col gap-2.5">
                {troubleshootItems.map((item, index) => {
                  const isExpanded = expandedIndex === index;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition-all duration-200 ${
                        isExpanded
                          ? "border-red-500/40 bg-red-500/5"
                          : "border-(--color-border) bg-transparent hover:border-(--color-border-strong)"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTroubleshoot(index)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-red-400">
                            {item.id}
                          </span>
                          <span className="text-xs font-bold text-(--color-text-primary)">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-(--color-text-muted) transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-red-400" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-200 ease-out ${
                          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-4 pb-3 pt-0.5 text-2xs leading-relaxed text-(--color-text-muted)">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Back & Support Link Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-3xs text-(--color-text-muted)">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="hover:text-red-400 transition-colors"
                >
                  ← {translate("error.go_back")}
                </button>
                <span>{translate("error.support_hotline")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StatusPageShell>
  );
}
