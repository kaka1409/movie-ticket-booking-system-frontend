"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface NotifyOptions {
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  notify: (message: string, options?: NotifyOptions) => void;
  dismiss: (id: number) => void;
}

const DEFAULT_DURATION_MS = 3000;
const MAX_TOASTS = 3;

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, options?: NotifyOptions) => {
      const id = nextId.current++;
      const toast: ToastItem = { id, message, variant: options?.variant ?? "success" };
      // Cap the stack so a burst of actions never covers the screen.
      setToasts((previous) => [...previous.slice(-(MAX_TOASTS - 1)), toast]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), options?.durationMs ?? DEFAULT_DURATION_MS),
      );
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, notify, dismiss }}>{children}</ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
