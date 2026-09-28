import type { Metadata } from "next";
import TeamExplorer from "@/components/team-explorer";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/experience/" } }
    : {}),
  title: "Experience",
};
export default function Page() {
  return (
    <div className="page-wrap">
      <header className="page-heading">
        <p className="eyebrow">Team experience</p>
        <h1>
          One engineer.
          <br />
          <span>Three perspectives.</span>
        </h1>
        <p>
          Mobile backend APIs, GenAI product work and professional indexing at
          WebMD.
        </p>
      </header>
      <TeamExplorer />
    </div>
  );
}
