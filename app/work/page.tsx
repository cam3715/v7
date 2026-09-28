import type { Metadata } from "next";
import WorkGrid from "@/components/work-grid";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/work/" } }
    : {}),
  title: "Work",
};
export default function Page() {
  return (
    <div className="page-wrap">
      <header className="page-heading">
        <p className="eyebrow">Experience & projects</p>
        <h1>
          Work behind
          <br />
          <span>the experience.</span>
        </h1>
        <p>
          Three areas of team experience and two fullstack projects. Explore the
          work by what it does.
        </p>
      </header>
      <WorkGrid />
    </div>
  );
}
