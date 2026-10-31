"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import { AlertTriangle, Home } from "lucide-react";
import StatusPageShell, { StatusPanel } from "@/components/shared/StatusPageShell";

const GLITCH_CHARS = "!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
          setChars((previous) => {
            const next = [...previous];
            next[i] = char;
            return next;
          });
          if (i === steps - 1) {
            setTimeout(() => setIsDone(true), 100);
          }
          return;
        }
        setChars((previous) => {
          const next = [...previous];
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

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { translate } = useLocale();
  const [glitchDone, setGlitchDone] = useState(false);

  const footer = error?.digest ? (
    <>
      <p>{translate("error.hint")}</p>
      <p className="mt-2">
        {translate("error.ref")}:{" "}
        <span className="font-mono break-all text-(--color-text-primary)/70">{error.digest}</span>
      </p>
    </>
  ) : (
    <p>{translate("error.hint")}</p>
  );

  return (
    <StatusPageShell
      aside={
        <div
          className={`transition duration-700 delay-200 ${
            glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <StatusPanel title={translate("error.panel_title")} footer={footer}>
            <Button variant="primary" onClick={reset}>
              {translate("error.try_again")}
            </Button>
            <Link href="/">
              <Button variant="outline" icon={Home} iconPosition="left">
                {translate("error.back_home")}
              </Button>
            </Link>
          </StatusPanel>
        </div>
      }
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 md:h-24 md:w-24">
        <AlertTriangle
          className="h-9 w-9 text-red-500 md:h-11 md:w-11 md:text-red-400"
          strokeWidth={2}
        />
      </div>

      <div className="mt-6 text-5xl font-black tracking-widest md:mt-8 md:text-7xl">
        <GlitchText text={translate("error.title")} onDone={() => setGlitchDone(true)} />
      </div>

      <p
        className={`mt-4 max-w-xs text-center text-sm text-(--color-text-muted) transition duration-700 md:max-w-lg md:text-left md:text-base md:leading-relaxed ${
          glitchDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {translate("error.description")}
      </p>

      <div
        className={`mt-8 w-full max-w-xs space-y-3 transition duration-700 delay-200 md:hidden ${
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
    </StatusPageShell>
  );
}
