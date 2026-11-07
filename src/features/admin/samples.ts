import type { AdminCatalogKind } from "./types";

/**
 * Prefill payloads for the console create forms — the "fill sample" button only
 * writes these into the form state; the operator still reviews and submits, so
 * every value must pass the zod schema on its own.
 */
export const ADMIN_FORM_SAMPLES = {
  movie: {
    title: "Test Movie",
    slug: "test-movie",
    status: "coming_soon",
    director: "Sample Director",
    language: "Vietnamese",
    duration: "120",
    releaseDate: "2026-12-01",
    ageRatingId: "",
    posterUrl: "",
    trailerUrl: "",
    synopsis: "A sample synopsis for testing the admin movie form.",
    synopsisVi: "Tóm tắt mẫu để kiểm tra form phim trong trang quản trị.",
    featuredLabel: "",
    featuredLabelVi: "",
    featuredDescription: "",
    featuredDescriptionVi: "",
    featuredFrom: "",
    featuredTo: "",
    featuredOrder: "",
    genreIds: [],
    isFeatured: false,
  },
  catalog: {
    genres: { name: "Test Genre", nameVi: "Thể loại thử", sortOrder: "0", isActive: true },
    formats: { name: "Test Format", nameVi: "Định dạng thử", sortOrder: "0", isActive: true },
    "age-ratings": {
      name: "Test Rating",
      nameVi: "Phân loại thử",
      sortOrder: "0",
      isActive: true,
    },
  },
  food: {
    name: "Test Snack",
    nameVi: "Đồ ăn thử",
    category: "popcorn",
    price: "50000",
    image: "",
    isActive: true,
  },
  combo: {
    name: "Test Combo",
    nameVi: "Combo thử",
    description: "A sample combo for testing the admin form.",
    descriptionVi: "Combo mẫu để kiểm tra form quản trị.",
    price: "150000",
    image: "",
    tag: "popular",
    isActive: true,
  },
  cinema: {
    name: "Test Cinema",
    address: "123 Sample Street, Ho Chi Minh City",
    badge: "New",
    // Latitude and longitude must be set as a pair (schema refine).
    latitude: "10.7769",
    longitude: "106.7009",
  },
  room: { name: "Test Room" },
  cast: {
    name: "Test Actor",
    roleName: "Protagonist",
    imageUrl: "",
    sortOrder: "1",
  },
  showtime: {
    // movieSlug/roomId/formatId are filled from the first available option by
    // the caller — they are ids the sample cannot know.
    date: "",
    startTime: "19:30",
  },
} as const;

export function catalogSample(kind: AdminCatalogKind): Record<string, string | boolean> {
  return { ...ADMIN_FORM_SAMPLES.catalog[kind] };
}
