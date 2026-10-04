import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "@/lib/i18n";

export const dynamic = "force-static";

const BASE = "https://mod.veritycn.site";

const routes: {
  path: string;
  lastmod: string;
  freq: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", lastmod: "2026-08-27T00:00:00Z", freq: "weekly", priority: 1 },
  { path: "/download", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.9 },
  { path: "/changelog", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/credits", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/play", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/instance", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/verity-config", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/gameplay", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/concepts", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/free-llm", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/ncm-music", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/commands", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
  { path: "/docs/ai-errors", lastmod: "2026-08-27T00:00:00Z", freq: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ path, lastmod, freq, priority }) =>
    LOCALES.map((l) => ({
      url: BASE + localePath(l.code, path),
      lastModified: lastmod,
      changeFrequency: freq,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((o) => [o.code, BASE + localePath(o.code, path)])
        ),
      },
    }))
  );
}
