import type { Metadata } from "next";
import Search from "@/components/search";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/search/" } }
    : {}),
  title: "Search my work",
};
export default function Page() {
  return (
    <div className="page-wrap narrow">
      <header className="page-heading">
        <p className="eyebrow">Find the relevant part</p>
        <h1>
          A shortcut
          <br />
          <span>to my work.</span>
        </h1>
        <p>
          Looking for API, AI or frontend experience? Search the published
          project and team summaries.
        </p>
      </header>
      <Search />
    </div>
  );
}
