import type { MetadataRoute } from "next";
import { SITE_URL } from "@/libs/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account/booking surfaces are personal — never index them.
        disallow: ["/profile", "/tickets", "/booking", "/notifications", "/login", "/register"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
