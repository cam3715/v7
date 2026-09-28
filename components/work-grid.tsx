"use client";
import { useState } from "react";
import { work, categories } from "@/lib/content";
import { WorkCard } from "./ui";
export default function WorkGrid() {
  const [category, setCategory] = useState<string>("All");
  const items = work.filter(
    (w) => category === "All" || w.category === category,
  );
  return (
    <>
      <div className="filters" role="group" aria-label="Filter work">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {items.length} work summaries shown
      </p>
      <div className="work-grid">
        {items.map((w) => (
          <WorkCard key={w.id} item={w} />
        ))}
      </div>
    </>
  );
}
