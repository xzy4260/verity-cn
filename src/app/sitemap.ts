import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://verity-cn.pages.dev";

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
  return routes.map(({ path, lastmod, freq, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: lastmod,
    changeFrequency: freq,
    priority,
  }));
}
