"use client";
import { useState } from "react";
import Link from "next/link";
import { work } from "@/lib/content";
export default function TeamExplorer() {
  const [selected, setSelected] = useState(0);
  const teams = work.slice(0, 3);
  const team = teams[selected];
  return (
    <section className="explorer section" aria-labelledby="explorer-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Three teams. A connected perspective.</p>
          <h2 id="explorer-title">Behind the experience.</h2>
        </div>
        <p>
          Explore where I work across the product, from the API to the index.
        </p>
      </div>
      <div className="explorer-shell">
        <div
          className="explorer-options"
          role="group"
          aria-label="Choose a team"
        >
          {teams.map((w, i) => (
            <button
              key={w.id}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span className="mono">0{i + 1}</span>
              <span>
                {["Mobile APIs", "Plume / GenAI", "Search & indexing"][i]}
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className={`explorer-panel ${team.accent}`} aria-live="polite">
          <div className="panel-heading">
            <span className="mono">{team.category}</span>
            <span className="outline-pill">Area of experience</span>
          </div>
          <h3>{team.title}</h3>
          <p>{team.summary}</p>
          <div className="focus-map" aria-label="Related areas of work">
            {team.visual.map((v, i) => (
              <div key={v}>
                <span className="mono">0{i + 1}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <p className="diagram-note">
            A map of related focus areas, not a production architecture.
          </p>
          <Link className="text-link" href={`/work/${team.id}/`}>
            Read the experience summary <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
