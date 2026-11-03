import { toLocaleTag } from "@/libs/utils";

/** A point on the map — what `navigator.geolocation` hands back and cinema rows carry. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Great-circle distance between two points, in km. */
export function getDistanceKm(from: Coordinates, to: Coordinates): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

/** `3.2` — the number only, so the caller owns the unit label. */
export function formatDistanceKm(km: number, locale: "en" | "vn"): string {
  return new Intl.NumberFormat(toLocaleTag(locale), { maximumFractionDigits: 1 }).format(km);
}

/**
 * Google Maps search link for a cinema — the same shape the booking rail embeds.
 * The address is the most precise query a booking payload carries; the name is
 * the fallback for surfaces (ticket modify) whose rows have no address.
 */
export function buildMapsHref(cinema: { name: string; address?: string }): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cinema.address || cinema.name,
  )}`;
}
