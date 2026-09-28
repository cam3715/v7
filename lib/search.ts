import { profile, work } from "./content";
export type SearchResult = {
  id: string;
  title: string;
  path: string;
  summary: string;
  tags: string[];
};
export function localSearch(query: string): SearchResult[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return work
    .map((w) => ({
      w,
      score: terms.reduce(
        (n, t) =>
          n +
          ([w.shortTitle, w.summary, w.contribution, ...w.tags, ...w.focus]
            .join(" ")
            .toLowerCase()
            .includes(t)
            ? 1
            : 0),
        0,
      ),
    }))
    .filter((x) => x.score === terms.length)
    .sort((a, b) => b.score - a.score || a.w.id.localeCompare(b.w.id))
    .slice(0, 10)
    .map(({ w }) => ({
      id: w.id,
      title: w.shortTitle,
      path: `/work/${w.id}/`,
      summary: w.summary,
      tags: w.tags,
    }));
}
export async function searchPortfolio(
  query: string,
  signal?: AbortSignal,
): Promise<{ results: SearchResult[]; source: string }> {
  const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (api) {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(cancel, 2500);
    try {
      if (signal?.aborted) throw new Error("aborted");
      const response = await fetch(`${api}/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("API unavailable");
      const body = await response.json();
      if (body.revision !== profile.revision || !Array.isArray(body.results))
        throw new Error("Content differs");
      // Resolve API IDs against the approved local catalog; never render remote URLs or HTML.
      const approved = new Map(work.map((w) => [w.id, w]));
      const results: SearchResult[] = body.results
        .slice(0, 10)
        .flatMap((r: { id?: string }) => {
          const w = approved.get(r.id ?? "");
          return w
            ? [
                {
                  id: w.id,
                  title: w.shortTitle,
                  path: `/work/${w.id}/`,
                  summary: w.summary,
                  tags: w.tags,
                },
              ]
            : [];
        });
      return { results, source: "Portfolio API" };
    } catch {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", cancel);
    }
  }
  return { results: localSearch(query), source: "On-device search" };
}
