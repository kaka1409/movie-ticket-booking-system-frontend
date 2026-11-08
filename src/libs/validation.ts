/**
 * Lenient phone check shared by the contact and profile forms: no letters or
 * unexpected symbols, 7–15 digits (E.164 ceiling). Formatting (spaces, dashes,
 * parens) is ignored.
 */
export function isValidPhone(phone: string): boolean {
  if (/[^\d\s()+-]/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Builds the contact number the backend stores from the phone field's two
 * inputs. A value the user already typed with a leading `+` is kept as the
 * international number (no double country code); anything else is prefixed
 * with the selected country code, non-digits stripped.
 */
export function normalizePhone(countryCode: string, phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  return `+${countryCode.replace(/\D/g, "")}${digits}`;
}

export const PASSWORD_UPPERCASE = /[A-Z]/;
export const PASSWORD_NUMBER = /[0-9]/;
export const PASSWORD_SPECIAL = /[!@#$%^&*]/;

/**
 * Password rules in display order — one source for every "your password needs…"
 * checklist (register form, change-password page). The tests are the same
 * predicates the Zod schemas validate with (`createRegisterSchema` uses the
 * regexes above), so a checklist can never disagree with the validator.
 *
 * `labelKey` resolves under `common.password.*`.
 */
export const PASSWORD_RULES = [
  { labelKey: "common.password.req_length", test: (value: string) => value.length >= 8 },
  {
    labelKey: "common.password.req_uppercase",
    test: (value: string) => PASSWORD_UPPERCASE.test(value),
  },
  { labelKey: "common.password.req_number", test: (value: string) => PASSWORD_NUMBER.test(value) },
  {
    labelKey: "common.password.req_special",
    test: (value: string) => PASSWORD_SPECIAL.test(value),
  },
] as const;

/**
 * Vietnamese mobile number: `0xxxxxxxxx` (10 digits) or E.164 `+84xxxxxxxxx`
 * (country code + 9 digits, leading 0 dropped). Shared by the register schema
 * and the backend `RegisterDto` — keep the two patterns in sync.
 */
export function isValidVnPhone(phone: string): boolean {
  return /^(0\d{9}|\+84\d{9})$/.test(phone.trim());
}

/** Pragmatic email shape check (not RFC-complete) — gates the live recipient lookup. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
