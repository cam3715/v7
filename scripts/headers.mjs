import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
nextRequire("@next/env").loadEnvConfig(process.cwd());
import { writeFileSync } from "node:fs";
// Cloudflare Pages headers. Static Next.js uses inline bootstrap scripts.
// No remote HTML or scripts are rendered; query text is always React-escaped.
const configured = process.env.NEXT_PUBLIC_API_URL;
let api = "";
if (configured) {
  const u = new URL(configured);
  if (!["http:", "https:"].includes(u.protocol))
    throw new Error("API must be HTTP(S)");
  api = " " + u.origin;
}
writeFileSync(
  "out/_headers",
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'${api}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
`,
);
