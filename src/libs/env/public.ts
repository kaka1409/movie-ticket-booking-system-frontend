import { z } from "zod";

/**
 * Client-safe environment (`NEXT_PUBLIC_*` — inlined into the browser bundle at
 * build time, so none of these values may be a secret).
 *
 * Every value has to stay a literal `process.env.NEXT_PUBLIC_*` read: Next
 * substitutes those expressions at build time and the browser bundle carries no
 * `process.env` object, so a computed lookup such as `process.env[name]` would
 * be `undefined` at runtime.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_BACKEND_URL: z.string().trim().url().optional(),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid public environment:\n${parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n")}`,
  );
}

export const publicEnv = {
  /** Canonical origin for SEO metadata (`metadataBase`, OG, sitemap). */
  siteUrl: parsed.data.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /**
   * Browser-side socket origin, or `null` when unset. In production `null`
   * means realtime is off: REST keeps working through the same-origin rewrite,
   * while guessing `<host>:8080` would point at the visitor's own machine.
   */
  backendUrl: parsed.data.NEXT_PUBLIC_BACKEND_URL ?? null,
  isProduction: process.env.NODE_ENV === "production",
} as const;
