import { z } from "zod";
import { PASSWORD_UPPERCASE, PASSWORD_NUMBER, PASSWORD_SPECIAL } from "@/libs/zod";

export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("auth.login.error_email_required"))
      .email(t("auth.login.error_email_invalid")),
    password: z.string().min(1, t("auth.login.error_password_required")),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(t: (key: string) => string) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t("auth.register.error_name_required"))
        .min(2, t("auth.register.error_name_min")),
      email: z
        .string()
        .trim()
        .min(1, t("auth.register.error_email_required"))
        .email(t("auth.register.error_email_invalid")),
      password: z
        .string()
        .min(1, t("auth.register.error_password_required"))
        .min(8, t("auth.register.error_password_min"))
        .regex(PASSWORD_UPPERCASE, t("auth.register.error_password_uppercase"))
        .regex(PASSWORD_NUMBER, t("auth.register.error_password_number"))
        .regex(PASSWORD_SPECIAL, t("auth.register.error_password_special")),
      confirmPassword: z.string().min(1, t("auth.register.error_confirm_required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.register.error_confirm_match"),
      path: ["confirmPassword"],
    });
}

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
