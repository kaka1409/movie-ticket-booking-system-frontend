import { z } from "zod";
import { requiredAmount, type Translate } from "./shared";

/** Cinema create/edit payload. */
export function createCinemaSchema(translate: Translate) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, translate("admin.cinemas.name_required"))
        .max(255, translate("admin.common.too_long")),
      address: z
        .string()
        .trim()
        .min(1, translate("admin.cinemas.address_required"))
        .max(255, translate("admin.common.too_long")),
      badge: z.string().trim().max(60, translate("admin.common.too_long")),
      latitude: z
        .string()
        .trim()
        .refine(
          (value) =>
            value === "" || (Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 90),
          translate("admin.cinemas.latitude_invalid"),
        )
        .transform((value) => (value === "" ? null : Number(value))),
      longitude: z
        .string()
        .trim()
        .refine(
          (value) =>
            value === "" || (Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 180),
          translate("admin.cinemas.longitude_invalid"),
        )
        .transform((value) => (value === "" ? null : Number(value))),
    })
    .refine(({ latitude, longitude }) => (latitude === null) === (longitude === null), {
      path: ["latitude"],
      message: translate("admin.cinemas.coordinates_pair"),
    });
}

export type AdminCinemaFormValues = z.infer<ReturnType<typeof createCinemaSchema>>;

/** Room create/edit payload. */
export function createRoomSchema(translate: Translate) {
  return z.object({
    cinemaId: z.string().min(1, translate("admin.rooms.cinema_required")),
    name: z
      .string()
      .trim()
      .min(1, translate("admin.rooms.name_required"))
      .max(120, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(120, translate("admin.common.too_long")),
  });
}

/** Seat type form: canonical name (select) + base price. */
export function seatTypeSchema(translate: Translate) {
  return z.object({
    name: z.string().min(1, translate("admin.seatTypes.name_required")),
    basePrice: requiredAmount(translate("admin.seatTypes.price_required")),
  });
}

export type AdminSeatTypeFormValues = z.infer<ReturnType<typeof seatTypeSchema>>;
