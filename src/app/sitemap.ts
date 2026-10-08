import type { MetadataRoute } from "next";
import { getMovies } from "@/features/movies/api";
import { SITE_URL } from "@/libs/site";

/**
 * Without a route-level `revalidate` the sitemap freezes at build time.
 * Effective cadence is bounded by the catalog fetch's 60s revalidate, so this
 * export mainly documents the route's staleness cap (new slugs reach
 * crawlers within a minute, no redeploy needed).
 */
export const revalidate = 60;

/**
 * Public, indexable routes only. Movie pages come from the live catalog;
 * when the API is unreachable the sitemap still returns the static routes
 * (a partial sitemap beats a 500 for crawlers).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/movies`, changeFrequency: "daily", priority: 0.9 },
  ];

  const result = await getMovies({ page: 1, limit: 100 });
  if ("error" in result) return staticRoutes;

  const movieRoutes: MetadataRoute.Sitemap = result.data.map((movie) => ({
    url: `${SITE_URL}/movies/${movie.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...movieRoutes];
}
