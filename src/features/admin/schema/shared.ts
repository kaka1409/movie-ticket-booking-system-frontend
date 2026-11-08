import { z } from "zod";

export type Translate = (key: string) => string;

/** Flattens a failed parse into `{ field: firstMessage }` for `AdminFormField`. */
export function toAdminFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && result[field] === undefined) {
      result[field] = issue.message;
    }
  }

  return result;
}

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const CATEGORY_TOKEN_PATTERN = /^[a-z][a-z0-9_-]*$/;
export const TRAILER_URL_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)/;

/** A required money field: blank is invalid, otherwise the amount must be ≥ 0. */
export function requiredAmount(message: string) {
  return z
    .string()
    .trim()
    .refine(
      (value) => value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0,
      message,
    );
}

/** A number field that is optional: blank means "not set", anything else must be in range. */
export function optionalInteger(min: number, max: number, message: string) {
  return z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= max),
      message,
    );
}

export const optionalDate = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || DATE_PATTERN.test(value), message);
