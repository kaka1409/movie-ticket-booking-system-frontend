/**
 * Next `instrumentation` hook — runs once per server start.
 *
 * Importing the server env module is the validation step: it parses and
 * type-checks every private variable, and refuses to boot a production server
 * without `BACKEND_URL` instead of letting pages render against `localhost`.
 * The import is runtime-gated because the edge runtime has no `process.env`.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/libs/env/server");
  }
}
