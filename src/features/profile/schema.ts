import { z } from "zod";
import {
  isValidPhone,
  PASSWORD_UPPERCASE,
  PASSWORD_NUMBER,
  PASSWORD_SPECIAL,
} from "@/libs/zod";

export function createProfileSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("profile.edit.error_name_required")),
    phone: z
      .string()
      .trim()
      .min(1, t("profile.edit.error_phone_required"))
      .refine(
        (val) => isValidPhone(val),
        t("profile.edit.error_phone_invalid"),
      ),
    dob: z
      .string()
      .min(1, t("profile.edit.error_dob_required")),
  });
}

export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export function createPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      current: z
        .string()
        .min(1, t("profile.password.error_current_required")),
      newPass: z
        .string()
        .min(1, t("profile.password.error_new_required"))
        .refine(
          (val) =>
            val.length >= 8 &&
            PASSWORD_UPPERCASE.test(val) &&
            PASSWORD_NUMBER.test(val) &&
            PASSWORD_SPECIAL.test(val),
          t("profile.password.error_new_requirements"),
        ),
      confirm: z
        .string()
        .min(1, t("profile.password.error_confirm_required")),
    })
    .refine((data) => data.newPass === data.confirm, {
      message: t("profile.password.error_confirm_match"),
      path: ["confirm"],
    });
}

export type PasswordFormData = z.infer<ReturnType<typeof createPasswordSchema>>;
