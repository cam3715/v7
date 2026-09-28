import type { Metadata } from "next";
import { profile } from "@/lib/content";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/contact/" } }
    : {}),
  title: "Contact",
};
export default function Page() {
  return (
    <div className="page-wrap narrow">
      <header className="page-heading">
        <p className="eyebrow">Let’s connect</p>
        <h1>
          Good things start
          <br />
          <span>with a conversation.</span>
        </h1>
        <p>
          For engineering roles, interesting projects or a conversation about
          backend, AI and search.
        </p>
      </header>
      <div className="contact-options">
        <a href={`mailto:${profile.email}`}>
          <span className="eyebrow">Email</span>
          <strong>{profile.email}</strong>
          <span aria-hidden="true">↗</span>
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          <span className="eyebrow">GitHub</span>
          <strong>github.com/cam3715</strong>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="muted">
        Based in {profile.location}. The email link opens your preferred mail
        app.
      </p>
    </div>
  );
}
