import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, priority: 1 },
    ...projects
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${site.url}/projects/${p.slug}/`,
        lastModified: now,
        priority: 0.8,
      })),
    // project sites published from their own repositories on this host, which only this sitemap can list
    ...projects
      .filter((p) => p.site?.startsWith(`${site.url}/`))
      .map((p) => ({ url: p.site!, priority: 0.8 })),
  ];
}
