import type { MetadataRoute } from "next";
import { work } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!base) return [];
  return [
    "/",
    "/about/",
    "/experience/",
    "/work/",
    "/projects/",
    "/contact/",
    "/resume/",
    "/privacy/",
    "/accessibility/",
    ...work.map((w) => `/work/${w.id}/`),
  ].map((path) => ({ url: base + path }));
}
