"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./pull-cord.module.css";

type ThemeMode = "light" | "dark";
type Drag = { x: number; y: number };
type Phase = "idle" | "dragging" | "swinging";
type PointerMotion = {
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const REST_LENGTH = 30;
const MAX_DRAG = 38;
const TRIGGER_DISTANCE = 18;

// Small screen-space physics constants. Units are px / ms.
const GRAVITY = 0.00215;
const ANGULAR_DAMPING = 0.00155;
const RADIAL_SPRING = 0.00058;
const RADIAL_DAMPING = 0.0062;
const MAX_PHYSICS_TIME = 2900;

function readTheme(): ThemeMode {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampVector(x: number, y: number, max: number): Drag {
  const length = Math.hypot(x, y);
  if (length <= max || length === 0) return { x, y };
  const scale = max / length;
  return { x: x * scale, y: y * scale };
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [drag, setDrag] = useState<Drag>({ x: 0, y: 0 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [burstId, setBurstId] = useState(0);
  const [burstTarget, setBurstTarget] = useState<ThemeMode>("light");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const startPoint = useRef<Drag>({ x: 0, y: 0 });
  const dragRef = useRef<Drag>({ x: 0, y: 0 });
  const pointerMotion = useRef<PointerMotion>({
    x: 0,
    y: 0,
    time: 0,
    vx: 0,
    vy: 0,
  });
  const physicsFrame = useRef<number | null>(null);
  const keyboardTimer = useRef<number | null>(null);

  useLayoutEffect(() => {
    setTheme(readTheme());

    return () => {
      if (physicsFrame.current !== null) cancelAnimationFrame(physicsFrame.current);
      if (keyboardTimer.current !== null) window.clearTimeout(keyboardTimer.current);
    };
  }, []);

  function updateDrag(next: Drag) {
    dragRef.current = next;
    setDrag(next);
  }

  function applyTheme(next: ThemeMode) {
    const root = document.documentElement;
    root.dataset.theme = next;
    root.style.colorScheme = next;
    setTheme(next);

    try {
      localStorage.setItem("theme", next);
    } catch {
      // The current page can still switch theme if storage is unavailable.
    }
  }

  function switchThemeFromHandle() {
    const root = document.documentElement;
    const next: ThemeMode = readTheme() === "dark" ? "light" : "dark";
    const rect = handleRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 120;
    const y = rect ? rect.top + rect.height / 2 : 64;

    root.style.setProperty("--cord-origin-x", `${x}px`);
    root.style.setProperty("--cord-origin-y", `${y}px`);
    root.dataset.themeTransition = next;

    setBurstTarget(next);
    setBurstId((value) => value + 1);

    const transitionDocument = document as ViewTransitionDocument;

    if (transitionDocument.startViewTransition) {
      const transition = transitionDocument.startViewTransition(() => applyTheme(next));
      transition.finished.finally(() => {
        delete root.dataset.themeTransition;
      });
      return;
    }

    applyTheme(next);
    window.setTimeout(() => {
      delete root.dataset.themeTransition;
    }, 650);
  }

  function writePhysicsFrame(
    x: number,
    y: number,
    length: number,
    angleFromHorizontal: number,
    tilt: number,
    energy: number,
  ) {
    const node = buttonRef.current;
    if (!node) return;

    node.style.setProperty("--physics-x", `${x}px`);
    node.style.setProperty("--physics-y", `${y}px`);
    node.style.setProperty("--physics-length", `${length}px`);
    node.style.setProperty("--physics-angle", `${angleFromHorizontal}deg`);
    const normalizedEnergy = clamp(energy, 0, 1);
    node.style.setProperty("--physics-tilt", `${tilt}deg`);
    node.style.setProperty("--physics-energy", `${normalizedEnergy}`);
    node.style.setProperty("--physics-glow", `${8 + normalizedEnergy * 8}px`);
    node.style.setProperty("--physics-scale-x", `${1 + normalizedEnergy * 0.035}`);
    node.style.setProperty("--physics-scale-y", `${1 - normalizedEnergy * 0.018}`);
    node.style.setProperty("--physics-highlight-opacity", `${0.58 + normalizedEnergy * 0.26}`);
  }

  function startReleasePhysics(released: Drag, velocity: Drag) {
    if (physicsFrame.current !== null) cancelAnimationFrame(physicsFrame.current);

    const endpointX = released.x;
    const endpointY = REST_LENGTH + released.y;
    let length = clamp(Math.hypot(endpointX, endpointY), 12, REST_LENGTH + MAX_DRAG);

    // Angle is measured from vertical so gravity naturally pulls it toward 0.
    let theta = Math.atan2(endpointX, endpointY);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    const releaseVX = clamp(velocity.x, -0.95, 0.95);
    const releaseVY = clamp(velocity.y, -0.95, 0.95);

    // Resolve the release velocity into tangential and radial components.
    const tangentialVelocity = releaseVX * cosTheta - releaseVY * sinTheta;
    let omega = clamp(tangentialVelocity / Math.max(length, 14), -0.014, 0.014);
    let radialVelocity = clamp(
      releaseVX * sinTheta + releaseVY * cosTheta,
      -0.55,
      0.55,
    );

    setPhase("swinging");
    updateDrag({ x: 0, y: 0 });

    const started = performance.now();
    let previous = started;

    const step = (now: number) => {
      let remaining = Math.min(now - previous, 32);
      previous = now;

      // Small substeps make the motion stable even if one frame arrives late.
      while (remaining > 0) {
        const dt = Math.min(remaining, 8);
        remaining -= dt;

        const safeLength = Math.max(length, 14);
        const angularAcceleration =
          -(GRAVITY / safeLength) * Math.sin(theta) -
          ANGULAR_DAMPING * omega -
          0.028 * omega * Math.abs(omega);

        omega += angularAcceleration * dt;
        theta += omega * dt;

        const radialAcceleration =
          -RADIAL_SPRING * (length - REST_LENGTH) -
          RADIAL_DAMPING * radialVelocity;

        radialVelocity += radialAcceleration * dt;
        length += radialVelocity * dt;
        length = clamp(length, 15, REST_LENGTH + 18);
      }

      const x = length * Math.sin(theta);
      const y = length * Math.cos(theta);
      const angleFromHorizontal = (Math.atan2(y, x) * 180) / Math.PI;
      const angularDegrees = (theta * 180) / Math.PI;
      const tilt = clamp(angularDegrees * 0.18 + omega * 720, -16, 16);
      const energy = Math.min(
        1,
        Math.abs(theta) * 0.95 + Math.abs(omega) * 45 + Math.abs(length - REST_LENGTH) / 12,
      );

      writePhysicsFrame(x, y, length, angleFromHorizontal, tilt, energy);

      const elapsed = now - started;
      const settled =
        elapsed > 700 &&
        Math.abs(theta) < 0.006 &&
        Math.abs(omega) < 0.000035 &&
        Math.abs(length - REST_LENGTH) < 0.16 &&
        Math.abs(radialVelocity) < 0.0025;

      if (settled || elapsed >= MAX_PHYSICS_TIME) {
        writePhysicsFrame(0, REST_LENGTH, REST_LENGTH, 90, 0, 0);
        physicsFrame.current = null;
        setPhase("idle");
        return;
      }

      physicsFrame.current = requestAnimationFrame(step);
    };

    // Paint the exact release position before the first simulated frame.
    writePhysicsFrame(
      endpointX,
      endpointY,
      length,
      (Math.atan2(endpointY, endpointX) * 180) / Math.PI,
      clamp(released.x * 0.28, -14, 14),
      1,
    );

    physicsFrame.current = requestAnimationFrame(step);
  }

  function release(triggerTheme: boolean) {
    const released = dragRef.current;
    const velocity = {
      x: pointerMotion.current.vx,
      y: pointerMotion.current.vy,
    };

    if (triggerTheme) switchThemeFromHandle();
    startReleasePhysics(released, velocity);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (phase === "swinging") return;

    const now = performance.now();
    startPoint.current = { x: event.clientX, y: event.clientY };
    pointerMotion.current = {
      x: event.clientX,
      y: event.clientY,
      time: now,
      vx: 0,
      vy: 0,
    };
    updateDrag({ x: 0, y: 0 });
    setPhase("dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (phase !== "dragging") return;

    const rawX = event.clientX - startPoint.current.x;
    const rawY = event.clientY - startPoint.current.y;
    updateDrag(clampVector(rawX, rawY, MAX_DRAG));

    const now = performance.now();
    const previous = pointerMotion.current;
    const dt = Math.max(now - previous.time, 8);
    const instantVX = (event.clientX - previous.x) / dt;
    const instantVY = (event.clientY - previous.y) / dt;

    pointerMotion.current = {
      x: event.clientX,
      y: event.clientY,
      time: now,
      // A little smoothing prevents noisy pointer samples from creating wild kicks.
      vx: previous.vx * 0.58 + instantVX * 0.42,
      vy: previous.vy * 0.58 + instantVY * 0.42,
    };
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (phase !== "dragging") return;

    const distance = Math.hypot(dragRef.current.x, dragRef.current.y);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    release(distance >= TRIGGER_DISTANCE);
  }

  function handleKeyboardPull() {
    if (phase !== "idle") return;

    pointerMotion.current = {
      x: 0,
      y: 0,
      time: performance.now(),
      vx: 0.18,
      vy: 0.1,
    };
    setPhase("dragging");
    updateDrag({ x: 13, y: 25 });

    keyboardTimer.current = window.setTimeout(() => {
      release(true);
      keyboardTimer.current = null;
    }, 150);
  }

  const isDark = theme === "dark";
  const distance = Math.hypot(drag.x, drag.y);
  const cordX = drag.x;
  const cordY = REST_LENGTH + drag.y;
  const cordLength = Math.max(8, Math.hypot(cordX, cordY));
  const cordAngle = (Math.atan2(cordY, cordX) * 180) / Math.PI;
  const tension = Math.min(distance / MAX_DRAG, 1);

  const pullStyle = {
    "--dx": `${drag.x}px`,
    "--dy": `${drag.y}px`,
    "--cord-length": `${cordLength}px`,
    "--cord-angle": `${cordAngle}deg`,
    "--tilt": `${drag.x * 0.28}deg`,
    "--tension": tension,
  } as CSSProperties;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.cordButton}
      data-mode={theme}
      data-phase={phase}
      data-ready={distance >= TRIGGER_DISTANCE ? "true" : "false"}
      role="switch"
      aria-checked={isDark}
      aria-label={`Pull the cord to switch to ${isDark ? "light" : "dark"} theme`}
      title="Drag the glass pull-cord in any direction"
      style={pullStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        if (phase === "dragging") release(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleKeyboardPull();
        }
      }}
    >
      <span className={styles.mount} aria-hidden="true" />
      <span className={styles.cord} aria-hidden="true" />
      <span ref={handleRef} className={styles.handle} aria-hidden="true">
        <span className={styles.handleHighlight} />
        <span className={styles.handleCore} />
      </span>
      <span className={styles.hint} aria-hidden="true">
        pull
      </span>
      {burstId > 0 && (
        <span
          key={burstId}
          className={styles.themeBloom}
          data-target={burstTarget}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
