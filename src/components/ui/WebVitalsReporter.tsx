"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Core Web Vitals instrumentation point. Metrics are logged in development so
 * LCP/CLS/INP regressions are visible locally; production stays silent until an
 * analytics endpoint is wired into the callback.
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[web-vitals] ${metric.name}: ${metric.value}`);
    }
  });
  return null;
}
