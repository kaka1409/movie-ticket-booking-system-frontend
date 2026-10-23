import { z } from "zod";
import { PASSWORD_UPPERCASE, PASSWORD_NUMBER, PASSWORD_SPECIAL } from "@/libs/zod";

/** Login fields; messages come from i18n. */
export function createLoginSchema(translate: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, translate("auth.login.error_email_required"))
      .email(translate("auth.login.error_email_invalid")),
    password: z.string().min(1, translate("auth.login.error_password_required")),
  });
}

/**
 * Register fields. The accepted-terms checkbox is **not** validated here — the
 * form checks it separately, so this schema alone does not gate submission.
 */
export function createRegisterSchema(translate: (key: string) => string) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, translate("auth.register.error_name_required"))
        .min(2, translate("auth.register.error_name_min")),
      email: z
        .string()
        .trim()
        .min(1, translate("auth.register.error_email_required"))
        .email(translate("auth.register.error_email_invalid")),
      password: z
        .string()
        .min(1, translate("auth.register.error_password_required"))
        .min(8, translate("auth.register.error_password_min"))
        .regex(PASSWORD_UPPERCASE, translate("auth.register.error_password_uppercase"))
        .regex(PASSWORD_NUMBER, translate("auth.register.error_password_number"))
        .regex(PASSWORD_SPECIAL, translate("auth.register.error_password_special")),
      confirmPassword: z.string().min(1, translate("auth.register.error_confirm_required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: translate("auth.register.error_confirm_match"),
      path: ["confirmPassword"],
    });
}
