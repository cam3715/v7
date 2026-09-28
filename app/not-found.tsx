import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-wrap narrow">
      <p className="eyebrow">404 / Page not found</p>
      <h1>
        This path
        <br />
        ends here.
      </h1>
      <p>Let’s get you back to the work.</p>
      <Link className="button dark" href="/work/">
        Explore work ↗
      </Link>
    </div>
  );
}
