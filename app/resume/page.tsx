import type { Metadata } from "next";
import { profile, work, resources } from "@/lib/content";
import PrintButton from "@/components/print-button";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/resume/" } }
    : {}),
  title: "Résumé",
};
export default function Page() {
  return (
    <article className="page-wrap narrow resume">
      <div className="resume-heading">
        <p className="eyebrow">Résumé / Public summary</p>
        <PrintButton />
      </div>
      <h1>{profile.name}</h1>
      <p className="resume-role">{profile.role} · AI & search</p>
      <p>
        {profile.location} ·{" "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <br />
        <a href={profile.github}>{profile.github}</a>
      </p>
      <section>
        <h2>Profile</h2>
        <p>{profile.bio}</p>
      </section>
      <section>
        <h2>Experience</h2>
        <h3>WebMD</h3>
        <p>Joined April 2025 · Engineering experience across three teams</p>
        {work.slice(0, 3).map((w) => (
          <div key={w.id}>
            <h4>{w.shortTitle}</h4>
            <p>{w.contribution}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>Selected projects</h2>
        {work.slice(3).map((w) => (
          <div key={w.id}>
            <h3>{w.shortTitle}</h3>
            <p>{w.subtitle}</p>
            <p>{w.contribution}</p>
            <ul>
              {w.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {w.links.map((link) => (
              <p key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}: {link.url}
                </a>
              </p>
            ))}
            {w.links.length === 0 && <p className="small">{w.linkNote}</p>}
          </div>
        ))}
      </section>
      <section>
        <h2>Technology experience</h2>
        <p>
          {[
            ...profile.languages,
            "FastAPI",
            "Solr",
            "Vector indexing",
            "Socket.IO",
            "Git",
            "Linux",
            "Docker",
          ].join(" · ")}
        </p>
      </section>
      <section>
        <h2>Education</h2>
        <p>
          Computer Science · Indian Institute of Information Technology, Pune
        </p>
      </section>
      <section>
        <h2>Certificates & community</h2>
        <ul>
          {resources.map((resource) => (
            <li key={resource.url}>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
