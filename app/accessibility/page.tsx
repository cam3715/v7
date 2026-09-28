import type { Metadata } from "next";
import { profile } from "@/lib/content";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/accessibility/" } }
    : {}),
  title: "Accessibility",
};
export default function Page() {
  return (
    <article className="page-wrap narrow prose legal">
      <p className="eyebrow">Built for more people</p>
      <h1>Accessibility.</h1>
      <p>
        The interface uses semantic headings, keyboard-operable controls,
        visible focus indicators and a skip link. Motion is reduced when your
        system requests it. Glass surfaces use a solid background fallback and
        keep text on readable layers.
      </p>
      <h2>Reading and navigation</h2>
      <p>
        Core pages are statically rendered. Search and filtering use JavaScript;
        all work summaries remain available through the Work page. The résumé
        can be printed or saved as a PDF using your browser.
      </p>
      <h2>Feedback</h2>
      <p>
        Accessibility is an ongoing task, and this is not a claim of
        independently certified conformance. If something prevents you from
        using the site, please email{" "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a> with the page
        and issue.
      </p>
    </article>
  );
}
