import { z } from "zod";

function isValidBookingPhone(phone: string): boolean {
  return /^\d{7,15}$/.test(phone);
}

export function createContactSchema(translate: (key: string) => string) {
  return z.object({
    name: z.string().trim().min(1, translate("booking.credentials.error_name_required")),
    email: z
      .string()
      .trim()
      .min(1, translate("booking.credentials.error_email_required"))
      .email(translate("booking.credentials.error_email_invalid")),
    phone: z
      .string()
      .trim()
      .min(1, translate("booking.credentials.error_phone_required"))
      .refine(isValidBookingPhone, translate("booking.credentials.error_phone_invalid")),
  });
}
