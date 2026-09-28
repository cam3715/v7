"use client";

import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import styles from "./liquid-controls.module.css";

const navItems = [
  ["/", "Home"],
  ["/projects/", "Projects"],
  ["/about/", "About"],
  ["/search/", "Search"],
] as const;

function getActiveIndex(pathname: string) {
  const index = navItems.findIndex(([href]) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.slice(0, -1)),
  );
  return index < 0 ? 0 : index;
}

const positionClasses = [styles.at0, styles.at1, styles.at2, styles.at3];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const routeIndex = getActiveIndex(pathname);

  const [visualIndex, setVisualIndex] = useState(routeIndex);
  const [flowDirection, setFlowDirection] = useState<"left" | "right">("right");
  const [motionKey, setMotionKey] = useState(0);

  const visualIndexRef = useRef(routeIndex);
  const navigationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    navItems.forEach(([href]) => router.prefetch(href));
  }, [router]);

  useEffect(() => {
    if (routeIndex !== visualIndexRef.current) {
      setFlowDirection(routeIndex > visualIndexRef.current ? "right" : "left");
      visualIndexRef.current = routeIndex;
      setVisualIndex(routeIndex);
      setMotionKey((value) => value + 1);
    }
  }, [routeIndex]);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  function handleNavigate(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    nextIndex: number,
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const currentIndex = visualIndexRef.current;
    if (nextIndex === currentIndex) return;

    setFlowDirection(nextIndex > currentIndex ? "right" : "left");
    visualIndexRef.current = nextIndex;
    setVisualIndex(nextIndex);
    setMotionKey((value) => value + 1);

    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
    }

    /*
      Start the route almost immediately after the liquid pill begins moving.
      The short delay gives the browser one or two frames to paint the pill's
      first stretch, then the page reveal runs at the same time as the slide.
    */
    navigationTimerRef.current = window.setTimeout(() => {
      router.push(href);
      navigationTimerRef.current = null;
    }, 70);
  }

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Chaitanya Meshram home">
        cam<span> / </span>
      </Link>

      <nav aria-label="Main navigation" className={`glass-nav ${styles.nav}`}>
        <span
          className={`${styles.pill} ${positionClasses[visualIndex]}`}
          aria-hidden="true"
        >
          <span
            key={`goo-${motionKey}`}
            className={`${styles.gooLayer} ${
              flowDirection === "right" ? styles.flowRight : styles.flowLeft
            }`}
          >
            <span className={styles.gooCore} />
            <span className={styles.gooDrop} />
          </span>

          <span
            key={`glass-${motionKey}`}
            className={`${styles.pillSurface} ${
              flowDirection === "right" ? styles.flowRight : styles.flowLeft
            }`}
          >
            <span className={styles.pillRefraction} />
            <span className={styles.pillShine} />
          </span>
        </span>

        {navItems.map(([href, label], index) => {
          const active = visualIndex === index;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={(event) => handleNavigate(event, href, index)}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <Link href="/contact/" className="header-contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
