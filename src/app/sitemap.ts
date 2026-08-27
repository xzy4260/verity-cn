import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://verity-cn.pages.dev";

const routes = [
  "",
  "/download",
  "/changelog",
  "/credits",
  "/docs",
  "/docs/play",
  "/docs/instance",
  "/docs/verity-config",
  "/docs/gameplay",
  "/docs/concepts",
  "/docs/free-llm",
  "/docs/ncm-music",
  "/docs/commands",
  "/docs/ai-errors",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/download" ? 0.9 : 0.7,
  }));
}
