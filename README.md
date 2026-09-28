# CAM — Chaitanya Meshram’s new portfolio

A new application built around **mobile backend APIs, Plume / GenAI, and Solr + vector indexing**, with fullstack project examples. This is a fresh codebase and visual design; it does not reuse the previous portfolio application.

## Project links are now visible

Open **Projects** in the main navigation or **Projects I’ve built** on the homepage. CodeCollab links directly to `https://github.com/cam3715/CodeCollab`. Both résumé projects now show their feature lists; certificate and community links appear on About and Résumé. See `docs/CHANGELOG.md`.

## Run the website first

Install Node.js 22+ (tested with 24.19.0). Open a terminal **inside this extracted `cam-portfolio` folder**:

```powershell
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Open **http://localhost:3000**. No database, API key or Docker is required. On macOS/Linux use `cp .env.example .env.local` instead of `Copy-Item`.

## Quick preview of the included production build

If Node.js is already installed, this ZIP also contains `out/`. From the project root run `node scripts/preview.mjs`, then open http://localhost:3000. This preview needs no package installation. To change code, use the development setup above and rebuild.

## What is included?

- Next.js 16.3.6 + React 19.3.0 + TypeScript. Static export for inexpensive hosting.
- Original glass-inspired UI, responsive mobile dock, accessible controls and reduced-motion support.
- Homepage, team explorer, filterable work, five work summaries, about, contact, search and printable résumé.
- Your updated GitHub: https://github.com/cam3715.
- Go 1.27.1 search API. JSON catalog mode works without a database.
- Optional PostgreSQL catalog, migration and owner-only import CLI.
- API tests, browser tests and six optional database integration tests.
- Setup, design, architecture, sequence/flow/ER diagrams, deployment and phase tracking.

## Read next

| Document                                    | Purpose                                               |
| ------------------------------------------- | ----------------------------------------------------- |
| [PRODUCT.md](docs/PRODUCT.md)               | Plain-English tour of every feature                   |
| [LOCAL.md](docs/LOCAL.md)                   | Exact Windows setup, API, database and test commands  |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)     | HLD, LLD, workflows, sequence and database diagrams   |
| [DESIGN.md](docs/DESIGN.md)                 | Visual system, page structure and responsive behavior |
| [DEPLOY.md](docs/DEPLOY.md)                 | Free-tier deployment and custom-domain steps          |
| [CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) | What came from your résumé, what needs confirmation   |
| [PLAN.md](docs/PLAN.md)                     | Completed phases, pending work and learning path      |
| [VERIFICATION.md](docs/VERIFICATION.md)     | Actual test results and limitations                   |

The app is designed to work without paid services. Free-provider quotas and availability can change. Your domain registration/renewal is separate. No cloud resource or DNS change has been made for you.

## Update content

Edit `content/portfolio.json`, bump `profile.revision`, run tests and rebuild. The app’s biography and résumé also contain curated prose in `app/about/page.tsx` and `app/resume/page.tsx`; update those when your role changes. A content edit is not automatically deployed. See the publish workflow in the architecture document.

## Folder map

| Path                     | Responsibility                                    |
| ------------------------ | ------------------------------------------------- |
| `app/`                   | Static pages, metadata and global CSS             |
| `components/`            | Interactive explorer, filters, search, navigation |
| `content/portfolio.json` | Approved public work and profile facts            |
| `lib/`                   | Content types and local/API search coordination   |
| `api/cmd/server/`        | Read-only Go HTTP API                             |
| `api/cmd/content/`       | Owner-only migration/import commands              |
| `api/internal/catalog/`  | JSON/PostgreSQL stores and tests                  |
| `api/migrations/`        | Database schema                                   |
| `tests/`                 | Content and Playwright checks                     |
| `docs/`                  | Product, design, setup and delivery documentation |

A public AI assistant, vector database and Solr server are **not** dependencies of this portfolio. Your professional AI/search experience is presented as content; the portfolio search is a small deterministic catalog lookup.
