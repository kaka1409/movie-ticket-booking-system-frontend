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

/** Pragmatic email shape check (not RFC-complete) — gates the live recipient lookup. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
