import Link from "next/link";
import type { Work } from "@/lib/content";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "↗"}</span>;
}
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="tiny-dot" />
      {children}
    </p>
  );
}
export function WorkCard({ item }: { item: Work }) {
  return (
    <article className={`work-card ${item.accent}`}>
      <div className="card-top">
        <span className="mono">
          {item.number} / {item.kind}
        </span>
        <Arrow />
      </div>
      <div className="card-mark" aria-hidden="true">
        {item.id === "mobile-apis" ? (
          <>
            <i />
            <i />
            <i />
          </>
        ) : item.id === "plume" ? (
          <span className="asterisk">✳</span>
        ) : item.id === "professional-indexer" ? (
          <span className="index-mark">[ · · · ]</span>
        ) : (
          <span className="code-mark">
            {item.id === "retrospective-board" ? "+ +" : "{ / }"}
          </span>
        )}
      </div>
      <p className="card-subtitle">{item.subtitle}</p>
      <h3>
        <Link href={`/work/${item.id}/`}>{item.shortTitle}</Link>
      </h3>
      <p>{item.summary}</p>
      {item.features.length > 0 && (
        <ul className="project-features">
          {item.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
      <div className="project-actions">
        <Link className="card-link" href={`/work/${item.id}/`}>
          View project details <Arrow />
        </Link>
        {item.links.map((link) => (
          <a
            key={link.url}
            className="button dark repo-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label} <Arrow />
          </a>
        ))}
        {item.kind === "Project" && item.links.length === 0 && (
          <p className="project-link-note">{item.linkNote}</p>
        )}
      </div>
    </article>
  );
}
