import Link from "next/link";
import { notFound } from "next/navigation";
import { work } from "@/lib/content";
export const dynamicParams = false;
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = work.find((w) => w.id === slug);
  return {
    title: w?.shortTitle,
    description: w?.summary,
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? { alternates: { canonical: `/work/${slug}/` } }
      : {}),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = work.find((w) => w.id === slug);
  if (!w) notFound();
  const next = work[(work.indexOf(w) + 1) % work.length];
  return (
    <article className="page-wrap case-study">
      <Link className="back-link" href="/work/">
        ← All work
      </Link>
      <header className="page-heading">
        <p className="eyebrow">
          {w.kind} / {w.number}
        </p>
        <h1>{w.title}</h1>
        <p>{w.subtitle}</p>
        <div className="tags">
          {w.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {w.kind === "Project" && (
          <div className="project-detail-links">
            {w.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="button dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
            {w.links.length === 0 && (
              <p className="project-link-note">{w.linkNote}</p>
            )}
          </div>
        )}
      </header>
      <section className={`case-visual ${w.accent}`}>
        <p className="mono">{w.shortTitle} / FOCUS MAP</p>
        <div className="focus-map">
          {w.visual.map((v, i) => (
            <div key={v}>
              <span className="mono">0{i + 1}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <p className="diagram-note">
          Related areas of work. This illustration does not represent a
          production system design.
        </p>
      </section>
      <div className="case-body">
        <aside>
          <p className="eyebrow">In this summary</p>
          <a href="#context">01 / Context</a>
          <a href="#contribution">02 / My contribution</a>
          <a href="#focus">03 / Focus areas</a>
          <a href="#scope">04 / Public scope</a>
        </aside>
        <div>
          <section id="context">
            <p className="eyebrow">01 / Context</p>
            <h2>What this work is about.</h2>
            <p>{w.context}</p>
          </section>
          <section id="contribution">
            <p className="eyebrow">02 / My contribution</p>
            <h2>Where I contributed.</h2>
            <p>{w.contribution}</p>
            {w.features.length > 0 && (
              <ul className="focus-list">
                {w.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            )}
          </section>
          <section id="focus">
            <p className="eyebrow">03 / Focus areas</p>
            <h2>The pieces that connect.</h2>
            <ul className="focus-list">
              {w.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p>{w.takeaway}</p>
          </section>
          <section id="scope" className="scope-note">
            <h2>About this summary</h2>
            <p>{w.boundary}</p>
          </section>
        </div>
      </div>
      <Link className="next-work" href={`/work/${next.id}/`}>
        <span className="eyebrow">Next / {next.kind}</span>
        <strong>{next.shortTitle} ↗</strong>
      </Link>
    </article>
  );
}
