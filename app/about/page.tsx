import type { Metadata } from "next";
import Link from "next/link";
import { profile, resources } from "@/lib/content";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/about/" } }
    : {}),
  title: "About",
};
export default function Page() {
  return (
    <div className="page-wrap">
      <header className="page-heading">
        <p className="eyebrow">A person, not just a stack</p>
        <h1>
          Hi, I’m Chaitanya.
          <br />
          <span>I connect the dots.</span>
        </h1>
        <p>{profile.bio}</p>
      </header>
      <div className="about-layout">
        <div className="identity-card">
          <div className="monogram" aria-hidden="true">
            cm.
          </div>
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
          <span className="outline-pill">{profile.location}</span>
          <a
            className="text-link"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub / cam3715 ↗
          </a>
        </div>
        <div className="prose">
          <p className="eyebrow">My work</p>
          <h2>From services to the interface.</h2>
          <p>
            At WebMD, my work has included the mobile backend team, the GenAI
            team working on Plume, and the Professional Indexer team.
          </p>
          <p>
            These areas connect backend API design, AI-assisted research and
            draft creation, and Solr and vector indexing. I also build fullstack
            products with React and Vue.
          </p>
          <h2>Technology experience</h2>
          <div className="tags">
            {[
              ...profile.languages,
              "FastAPI",
              "Solr",
              "Vector indexing",
              "WebSockets",
              "Git",
              "Docker",
              "Linux",
            ].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <p>
            I choose tools around the problem. My interests are broader than a
            particular language: useful products, clear interfaces and the
            systems that support them.
          </p>
          <h2>Certificates & community</h2>
          <ul className="resource-links">
            {resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resource.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <h2>Education</h2>
          <p>
            Computer Science · Indian Institute of Information Technology, Pune.
          </p>
          <div className="hero-actions">
            <Link className="button dark" href="/resume/">
              View résumé ↗
            </Link>
            <Link className="button soft" href="/contact/">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
