"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchPortfolio, type SearchResult } from "@/lib/search";
export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function run(value: string) {
    const q = value.trim();
    request.current?.abort();
    if (!q) {
      setResults([]);
      setStatus("Enter a skill, project or team to search.");
      setBusy(false);
      return;
    }
    const ctrl = new AbortController();
    request.current = ctrl;
    setBusy(true);
    setStatus("Searching…");
    try {
      const response = await searchPortfolio(q, ctrl.signal);
      if (ctrl.signal.aborted) return;
      setResults(response.results);
      setStatus(
        `${response.results.length} ${response.results.length === 1 ? "result" : "results"} · ${response.source}`,
      );
    } catch {
      if (!ctrl.signal.aborted)
        setStatus("Search could not finish. Please try again.");
    } finally {
      if (!ctrl.signal.aborted) setBusy(false);
    }
  }
  return (
    <div className="search-app">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
        role="search"
      >
        <label htmlFor="portfolio-query">Search my work</label>
        <div className="search-input">
          <input
            id="portfolio-query"
            type="search"
            maxLength={200}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try Solr, Vue, APIs or Plume"
            autoComplete="off"
          />
          <button className="button dark" type="submit" disabled={busy}>
            {busy ? "Searching…" : "Search ↗"}
          </button>
        </div>
      </form>
      <div className="suggestions">
        <span>Try:</span>
        {["Solr", "Plume", "Vue", "APIs"].map((q) => (
          <button
            key={q}
            onClick={() => {
              setQuery(q);
              void run(q);
            }}
          >
            {q}
          </button>
        ))}
      </div>
      <p role="status" className="search-status">
        {status}
      </p>
      <div className="search-results">
        {results.map((r) => (
          <Link key={r.id} href={r.path}>
            <div>
              <span className="eyebrow">{r.tags.join(" / ")}</span>
              <h2>{r.title}</h2>
              <p>{r.summary}</p>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      {status.startsWith("0 results") && (
        <div className="empty-state">
          <h2>No matching work yet.</h2>
          <p>
            Try a broader term, or <Link href="/work/">browse all work</Link>.
          </p>
        </div>
      )}
      <p className="small muted">
        Search returns published portfolio summaries. It does not generate
        answers or send information to an AI provider.
      </p>
      <noscript>
        Search needs JavaScript. You can still{" "}
        <a href="/work/">browse every work summary</a>.
      </noscript>
    </div>
  );
}
