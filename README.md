# CHOKIE IT SOLUTIONS

## Phase 3 backend

PostgreSQL, Prisma migrations, real administrator authentication/RBAC, content and business APIs, private media storage, email outbox, metrics, and audits are implemented. See [the verified Phase 3 report](docs/phase-3-report.md), [setup instructions](docs/backend-setup.md), and [API contracts](docs/api.md).

The first administrator email is configured locally. Run `npm run admin:bootstrap` in an interactive terminal to enter a hidden password, then visit `/admin/login`. Public forms and development admin demo state await Phase 4 API integration. Production does not render demo statistics.

Public frontend built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style Radix Button, Lucide icons, Motion, React Hook Form, and Zod.

## Run locally

Use Node.js 24 and follow the backend setup guide before starting the application.

```sh
npm ci
npm run db:generate
npm run dev -- --port 3001
```

Open http://127.0.0.1:3001. For production, run `npm run build`, then `npm start`. Run `npm run typecheck` for standalone type verification.

Before deployment, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your verified public origin for social metadata.

## Architecture

- `src/lib/content.ts`: typed service records, training, partners, and solution categories. Replace this layer with a CMS adapter in a future phase.
- `src/components/site.tsx`: shared navigation, footer, cards, sections, and directory.
- `src/components/inquiry-form.tsx`: frontend-only validation for contact, training, and support.
- `src/app/(public)/[page]/page.tsx`: public content pages with route metadata.
- `src/app/(public)/services/[slug]/page.tsx`: nine statically generated service pages.
- `src/components/ui/button.tsx`: shadcn-compatible button with Radix Slot and CVA.

## Source and editorial decisions

Company facts derive from the supplied Website Profile 1.pdf. The unchanged supplied JPEG is stored at `public/logo.jpg`; CSS clips surrounding blank canvas without altering the logo artwork. Company profile PDF is retained at `reference/company-profile.pdf` (kept outside public assets).

Partner names use conventional spelling where the source has obvious typographical errors. Categories are editorial groupings, not claimed partnership tiers. No third-party logos are used. Client references remain unpublished pending approval. Contact details, location, map, and social channels are clearly marked as pending. Training descriptions are introductory; no certification, schedule, or price is promised.

Illustrative Unsplash photographs are stored locally and served through Next Image; they do not depict company premises. See `reference/asset-sources.md` for source URLs. Before production publication, review photo licensing, partner status, client permissions, contact details, and canonical domain metadata.

## Phase boundary

The Phase 3 backend persists real records through its APIs. Existing public form actions still validate locally and explicitly explain that nothing was sent or saved. Development admin content is labeled demo state behind real authentication. Phase 4 will connect these interfaces to the backend after review.

## Accessibility and responsiveness

Semantic landmarks, visible focus styles, skip link, labeled form controls and errors, reduced-motion support, keyboard-operated menus, responsive grids, and mobile navigation are included. No formal WCAG certification is claimed.

