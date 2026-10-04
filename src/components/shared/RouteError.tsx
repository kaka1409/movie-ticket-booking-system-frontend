"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import { AlertTriangle, Home } from "lucide-react";

const GLITCH_CHARS = "!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Decode-animation: every character of `target` cycles through random glyphs
 * before settling on its real value. The LAST character to settle flips
 * `isDone` (deferred by 100ms so the final paint lands before `onDone`).
 */
function useGlitchDecode(target: string, duration = 2000) {
  const [chars, setChars] = useState(() =>
    target.split("").map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]),
  );
  const [isDone, setIsDone] = useState(false);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    const steps = target.length;
    const stepDuration = duration / steps;

    target.split("").forEach((char, i) => {
      let count = 0;
      const maxCycles = 7;
      const interval = setInterval(() => {
        count++;
        if (count >= maxCycles) {
          clearInterval(interval);
          setChars((prev) => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
          if (i === steps - 1) {
            setTimeout(() => setIsDone(true), 100);
          }
          return;
        }
        setChars((prev) => {
          const next = [...prev];
          next[i] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          return next;
        });
      }, stepDuration / maxCycles);

      intervalsRef.current.push(interval);
    });

    return () => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [target, duration]);

  const isDecoded = useCallback((index: number) => chars[index] === target[index], [chars, target]);

  return { chars, isDone, isDecoded };
}

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
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={
            !isDecoded(i)
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

export default function RouteError({ reset }: { error: Error; reset: () => void }) {
  const { translate } = useLocale();
  const [glitchDone, setGlitchDone] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-(--color-bg)">
      {/* Error icon */}
      <div className="mt-14 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle size={36} className="text-red-600" />
      </div>

      {/* Glitch decode title */}
      <div className="mt-6 text-5xl font-black tracking-widest">
        <GlitchText text={translate("error.title")} onDone={() => setGlitchDone(true)} />
      </div>

      {/* Description — fades in after decode */}
      <p
        className={`mt-4 text-sm text-center text-(--color-text-muted) max-w-xs transition-all duration-700 ${
          glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {translate("error.description")}
      </p>

      {/* CTAs — cascade in after decode */}
      <div
        className={`mt-8 w-full max-w-xs space-y-3 transition-all duration-700 delay-200 ${
          glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Button variant="primary" onClick={reset}>
          {translate("error.try_again")}
        </Button>
        <Link href="/">
          <Button variant="outline" icon={Home} iconPosition="left">
            {translate("error.back_home")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
