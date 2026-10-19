"use client";

import { AlertCircle } from "lucide-react";

/**
 * Inline form-level failure box: the server's answer when a submit is rejected
 * (wrong credentials, email taken, transport error). `role="alert"` so screen
 * readers announce it the moment it replaces the previous state.
 */
export default function ErrorAlert({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 ${className}`}
    >
      <AlertCircle size={15} className="shrink-0 text-red-400" />
      <p className="text-xs font-semibold text-red-400">{message}</p>
    </div>
  );
}
