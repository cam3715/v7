import data from "@/content/portfolio.json";
export const { profile, work, resources } = data;
export type Work = (typeof work)[number];
export const categories = [
  "All",
  "Backend",
  "AI & Search",
  "Fullstack",
] as const;
