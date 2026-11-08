import { z } from "zod";
import { isValidPhone, PASSWORD_UPPERCASE, PASSWORD_NUMBER, PASSWORD_SPECIAL } from "@/libs/validation";

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** `YYYY-MM-DD` that names a real calendar day and is not in the future. */
function isValidBirthDate(value: string): boolean {
  if (!DATE_INPUT_PATTERN.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(time)) return false;
  // Date.parse normalises overflow dates (2025-02-31 -> Mar 3); the round-trip
  // check rejects them.
  if (new Date(time).toISOString().slice(0, 10) !== value) return false;
  return value <= new Date().toISOString().slice(0, 10);
}

export function createProfileSchema(translate: (key: string) => string) {
  return z.object({
    name: z.string().trim().min(1, translate("profile.edit.error_name_required")),
    phone: z
      .string()
      .trim()
      .min(1, translate("profile.edit.error_phone_required"))
      .refine((val) => isValidPhone(val), translate("profile.edit.error_phone_invalid")),
    dob: z
      .string()
      .min(1, translate("profile.edit.error_dob_required"))
      .refine(isValidBirthDate, translate("profile.edit.error_dob_invalid")),
  });
}

export function createPasswordSchema(translate: (key: string) => string) {
  return z
    .object({
      current: z.string().min(1, translate("profile.password.error_current_required")),
      newPass: z
        .string()
        .min(1, translate("profile.password.error_new_required"))
        .refine(
          (val) =>
            val.length >= 8 &&
            PASSWORD_UPPERCASE.test(val) &&
            PASSWORD_NUMBER.test(val) &&
            PASSWORD_SPECIAL.test(val),
          translate("profile.password.error_new_requirements"),
        ),
      confirm: z.string().min(1, translate("profile.password.error_confirm_required")),
    })
    .refine((data) => data.newPass === data.confirm, {
      message: translate("profile.password.error_confirm_match"),
      path: ["confirm"],
    })
    .refine((data) => data.newPass !== data.current, {
      message: translate("profile.password.error_new_same_as_current"),
      path: ["newPass"],
    });
}
