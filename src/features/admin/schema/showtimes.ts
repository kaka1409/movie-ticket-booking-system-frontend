import { z } from "zod";
import { DATE_PATTERN, TIME_PATTERN, type Translate } from "./shared";

/** Showtime create/edit payload. */
export function createShowtimeSchema(translate: Translate) {
  return z.object({
    movieSlug: z.string().min(1, translate("admin.showtimes.movie_required")),
    roomId: z.string().min(1, translate("admin.showtimes.room_required")),
    formatId: z.string().min(1, translate("admin.showtimes.format_required")),
    date: z
      .string()
      .trim()
      .refine((value) => DATE_PATTERN.test(value), translate("admin.showtimes.date_invalid")),
    startTime: z
      .string()
      .trim()
      .refine((value) => TIME_PATTERN.test(value), translate("admin.showtimes.time_invalid")),
  });
}

export type AdminShowtimeFormValues = z.infer<ReturnType<typeof createShowtimeSchema>>;
