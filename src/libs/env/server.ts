import "server-only";
import { z } from "zod";

/**
 * Server-only environment.
 *
 * Next inlines `NEXT_PUBLIC_*` into the client bundle but leaves everything
 * else to the Node process, so a module that reads these values must never
 * reach a client bundle — `server-only` turns that mistake into a build error
 * instead of a silent `undefined`.
 *
 * Validation runs once per process at import time: a malformed value stops
 * startup here rather than sending every request to the wrong origin.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_URL: z.string().trim().url().optional(),
  API_PREFIX: z
    .string()
    .trim()
    .regex(/^\/[A-Za-z0-9/_\-]*$/, "must start with / and hold no query or fragment")
    .optional(),
});

const parsed = serverEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL: process.env.BACKEND_URL,
  API_PREFIX: process.env.API_PREFIX,
});

if (!parsed.success) {
  throw new Error(
    `Invalid server environment:\n${parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n")}`,
  );
}

const isProduction = parsed.data.NODE_ENV === "production";

// A deployed build that falls back to localhost answers nothing but connection
// refused, and the failure surfaces as an empty page far from the cause.
if (isProduction && !parsed.data.BACKEND_URL) {
  throw new Error("BACKEND_URL is required when NODE_ENV=production");
}

/** Trailing slash would produce `//api/v1` once the prefix is appended. */
const apiPrefix = (parsed.data.API_PREFIX ?? "/api/v1").replace(/\/+$/, "");

export const serverEnv = {
  nodeEnv: parsed.data.NODE_ENV,
  isProduction,
  backendUrl: parsed.data.BACKEND_URL ?? "http://localhost:8080",
  apiPrefix,
} as const;
