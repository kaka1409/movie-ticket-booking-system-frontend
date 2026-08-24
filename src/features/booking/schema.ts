import { z } from "zod";
import { isValidPhone } from "@/libs/zod";

export function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("booking.credentials.error_name_required")),
    email: z
      .string()
      .trim()
      .min(1, t("booking.credentials.error_email_required"))
      .email(t("booking.credentials.error_email_invalid")),
    phone: z
      .string()
      .trim()
      .min(1, t("booking.credentials.error_phone_required"))
      .refine(
        (val) => isValidPhone(val),
        t("booking.credentials.error_phone_invalid"),
      ),
  });
}

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;
