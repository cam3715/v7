import type { Metadata } from "next";
import Link from "next/link";
import { work, profile } from "@/lib/content";
import { WorkCard } from "@/components/ui";
export const metadata: Metadata = {
  title: "Projects",
  description:
    "Chaitanya Meshram’s fullstack projects: Retrospective Board for Teams and CodeCollab, with source links and implementation details.",
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/projects/" } }
    : {}),
};
export default function Projects() {
  return (
    <div className="page-wrap">
      <header className="page-heading">
        <p className="eyebrow">Selected projects / Source & details</p>
        <h1>
          Things I’ve
          <br />
          <span>built end to end.</span>
        </h1>
        <p>
          Real-time collaboration, backend services and the interfaces that
          bring them together. Explore each project and its available source
          code.
        </p>
        <a
          className="text-link"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          All repositories / cam3715 ↗
        </a>
      </header>
      <div className="work-grid two">
        {work
          .filter((w) => w.kind === "Project")
          .map((w) => (
            <WorkCard key={w.id} item={w} />
          ))}
      </div>
      <section className="projects-experience">
        <p className="eyebrow">Professional experience</p>
        <h2>Mobile APIs. Plume. Search indexing.</h2>
        <p>
          Alongside these projects, explore my contributions across three
          engineering teams.
        </p>
        <Link className="button soft" href="/experience/">
          Explore team experience ↗
        </Link>
        <Link className="text-link" href="/work/">
          View all work ↗
        </Link>
      </section>
    </div>
  );
}
