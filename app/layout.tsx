import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { profile } from "@/lib/content";
import "./globals.css";
const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteURL ? { metadataBase: new URL(siteURL) } : {}),
  title: {
    default: "Chaitanya Meshram — Backend, AI & Search",
    template: "%s — Chaitanya Meshram",
  },
  icons: { icon: "/favicon.svg" },
  description: profile.bio,
  openGraph: {
    title: "Chaitanya Meshram — Reliable backends. Intelligent experiences.",
    description: profile.bio,
    type: "website",
    ...(siteURL ? { images: ["/social.png"] } : {}),
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var root=document.documentElement;var saved=null;try{saved=localStorage.getItem("theme");}catch(e){}var theme=(saved==="dark"||saved==="light")?saved:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");root.dataset.theme=theme;root.style.colorScheme=theme;})();`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div>
            <Link href="/" className="wordmark">
              cam<span> / </span>
            </Link>
            <p>Thoughtful systems. Useful products.</p>
          </div>
          <div className="footer-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <Link href="/resume/">Résumé</Link>
            <Link href="/privacy/">Privacy</Link>
            <Link href="/accessibility/">Accessibility</Link>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} {profile.name}
            <br />
            {profile.location}
          </p>
        </footer>
      </body>
    </html>
  );
}
