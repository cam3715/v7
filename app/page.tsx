export const metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/" } }
    : {}),
};
import Link from "next/link";
import { profile, work } from "@/lib/content";
import { Label, WorkCard } from "@/components/ui";
import TeamExplorer from "@/components/team-explorer";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Label>Chaitanya Meshram · Software engineer</Label>
          <h1>
            Reliable backends.
            <br />
            <span>Intelligent</span>
            <br />
            experiences.
          </h1>
          <p className="hero-description">
            I build across APIs, AI-powered products and search indexing —
            connecting the systems behind the screen to the experience in front
            of it.
          </p>
          <div className="hero-actions">
            <Link className="button dark" href="/work/">
              Explore my work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button soft" href="/about/">
              Meet Chaitanya
            </Link>
          </div>
          <div className="hero-caption">
            <span className="status-dot" />
            <span>Backend / Fullstack / AI</span>
            <span className="caption-line" />
            <span>Mumbai, India</span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Three areas of experience: APIs, AI and search"
        >
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="art-grid" />
          <div className="art-label mono">A CONNECTED PERSPECTIVE</div>
          <div className="glass-tile tile-api">
            <div className="tile-top">
              <span className="tile-icon">{`{ }`}</span>
              <span className="mono">01 / BUILD</span>
            </div>
            <h2>
              Behind
              <br />
              the interface.
            </h2>
            <div className="tile-bottom">
              <span>Mobile backend APIs</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="api-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="glass-tile tile-ai">
            <div className="tile-top">
              <span className="tile-icon star">✳</span>
              <span className="mono">02 / CREATE</span>
            </div>
            <h2>
              Intelligence,
              <br />
              put to work.
            </h2>
            <div className="tile-bottom">
              <span>Plume · GenAI</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
          <div className="glass-tile tile-search">
            <div className="tile-top">
              <span className="tile-icon">⌕</span>
              <span className="mono">03 / DISCOVER</span>
            </div>
            <h2>
              Find the
              <br />
              meaning.
            </h2>
            <div className="tile-bottom">
              <span>Solr + vector indexing</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
          <div className="art-caption">
            <span className="status-dot" /> APIs → AI → Search
          </div>
        </div>
      </section>
      <section className="skill-strip" aria-label="Technology experience">
        <span className="mono">TOOLS I WORK WITH</span>
        <div>
          {profile.languages.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </section>
      <section className="section selected-work" id="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected projects</p>
            <h2>Projects I’ve built.</h2>
          </div>
          <Link className="text-link" href="/projects/">
            Browse projects ↗
          </Link>
        </div>
        <div className="work-grid two">
          {work.slice(3).map((w) => (
            <WorkCard key={w.id} item={w} />
          ))}
        </div>
      </section>
      <TeamExplorer />
      <section className="about-band">
        <p className="eyebrow">A little about me</p>
        <h2>
          I like the part where
          <br />
          everything connects.
        </h2>
        <div>
          <p>
            {profile.bio} My experience spans Python, .NET, Go and Java,
            alongside React and Vue.
          </p>
          <Link className="text-link" href="/about/">
            The person behind the work ↗
          </Link>
        </div>
      </section>
      <section className="contact-band">
        <div>
          <p className="eyebrow">Have something in mind?</p>
          <h2>Let’s make it useful.</h2>
        </div>
        <Link className="button dark" href="/contact/">
          Start a conversation ↗
        </Link>
      </section>
    </>
  );
}
