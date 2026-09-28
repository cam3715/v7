import type { Metadata } from "next";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/privacy/" } }
    : {}),
  title: "Privacy",
};
export default function Page() {
  return (
    <article className="page-wrap narrow prose legal">
      <p className="eyebrow">Last updated 27 September 2026</p>
      <h1>Privacy, simply.</h1>
      <h2>Browsing</h2>
      <p>
        This application does not include analytics, advertising, tracking
        cookies or account registration. Hosting providers may process network
        information, including IP addresses and access logs, to serve the
        website.
      </p>
      <h2>Portfolio search</h2>
      <p>
        By default, search runs in your browser against the public portfolio
        content. When the optional portfolio API is enabled, your submitted
        query is sent to that API. The application does not intentionally store
        queries, and its server does not log query bodies. Its hosting provider
        may retain operational logs. Search falls back to the local catalog if
        the API is unavailable.
      </p>
      <h2>Contact</h2>
      <p>
        The email link opens your mail app. Your message is handled by your
        email provider and the recipient’s provider. GitHub links take you to an
        external service with its own privacy policy.
      </p>
      <h2>No AI chat service</h2>
      <p>
        This portfolio does not send your inputs to an LLM or embedding
        provider. Search looks up published work summaries.
      </p>
    </article>
  );
}
