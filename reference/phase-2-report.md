# Phase 2 — Admin dashboard handoff

## Completed

The existing public site is preserved. Its original pages now live in the `(public)` route group, which keeps every public URL unchanged and separates the public header and footer from the admin shell.

The dashboard includes all 21 requested routes: overview, homepage, about, services, solutions, training, partners, clients, testimonials, pages, inquiries, consultations, registrations, support, media, SEO, users, notifications, activity, settings, and profile.

- Responsive sidebar with collapsible groups, compact mode, mobile drawer, active navigation, breadcrumbs, workspace search, notification count, profile menu, and exit control.
- Six derived demo metrics; inquiry activity, consultation, ticket status, and training interest visualizations; recent activity and CSV export.
- Local CRUD, search, category/status filters, sorting, pagination, selection, bulk updates, deletion confirmations, reorder controls, and content previews.
- Homepage drafts, image selection, editable section content, visibility toggles, drag-and-drop ordering with keyboard button alternatives, and an explicitly local publication status.
- Reusable React Hook Form / Zod editors, dynamic feature and benefit lists, related-service selection, metadata limits, slug validation, date checks, and publication approval rules.
- Synthetic customer records with statuses, notes, assignments, detail views, CSV exports, and a support timeline whose replies are explicitly not sent.
- Local media selection, drag-and-drop, grid/list views, search, MIME filtering, previews, rename, delete confirmation, and URL copy.
- Page SEO with a live editor preview, settings tabs, demo users and role descriptions, notification read/unread controls, and local activity history.
- Original CHOKIE logo and Phase 1 brand colors. Color inputs preserve the supplied blue and green values.

## Demo behavior and integration boundary

`src/lib/admin/types.ts` defines shared models and the repository contract. `repository.ts` implements browser-session storage. `mock-data.ts` centralizes development fixtures and derives company content from the existing Phase 1 data layer. `config.ts` defines module fields, columns, and workflow choices. React components do not call production services.

Edits persist in `sessionStorage` for the current browser tab and survive a reload. **Reset demo data** in the profile menu restores the fixtures. No demo edit changes the public website. The demo-only publication status never deploys content. Synthetic customer identities use `example.com`; no testimonials or training schedules are fabricated.

The admin layout and module route reject every non-development environment with `notFound()`. Production builds return **404 for `/admin` and every admin module**. The development server binds to loopback by default. There is no fake login or permission enforcement.

Awaiting later phases: PostgreSQL, authenticated identities, server-enforced authorization, real audit logs, permanent media storage, submission APIs, email/reply delivery, publication to the website, and credential/security management. Profile security controls explain that these require Phase 3.

## Verification

- TypeScript and production build pass.
- All 21 admin routes respond in development. All 39 production checks pass: 21 admin routes return 404 and all 18 public routes return 200. Evidence is in `admin-production-route-checks.json`.
- **147 responsive browser checks** cover all 21 pages at 320, 375, 430, 768, 1024, 1440, and 1920 pixels. Every document’s scroll width fits its client width. Tables scroll inside their containers. Evidence is in `admin-responsive-results.json`.
- A service was created, searched, selected, and deleted through a confirmation dialog; required-field errors were checked.
- Partner publication without verification or approval was blocked in the browser.
- Homepage order/visibility and draft saving were checked. Ticket replies were added only to a local timeline.
- An image was selected locally, renamed, and previewed without an upload API.
- Keyboard settings-tab navigation, mobile drawer, dialog Escape behavior, and the original brand color controls were checked.
- Five automated validation tests cover approval gates, required fields/slugs/metadata, training dates, and allowed links.

This is desktop-browser responsive testing, not physical-device testing or formal WCAG certification.

## Known limits

Browser session storage has a size quota. Media accepts JPEG, PNG, WebP, and GIF up to 2 MB each and 4 MB per selection. If storage is full, an explicit message says that updates remain in memory only. Selected support attachments store a filename reference only. The profile’s password and security controls remain unavailable until authentication exists.

No blocking build or TypeScript issues remain. Public contact details and client publication approvals remain pending from Phase 1.

## Run

```powershell
cd C:\Users\Mihret\Documents\mercy\chokie
npm install
npm run dev
```

Visit the printed local URL followed by `/admin`. The current preview uses `http://127.0.0.1:3001/admin`.

```powershell
npm run typecheck
npm test
npm run build
```

The validation test command uses Node’s TypeScript stripping and requires Node 22.18+; this project was verified with Node 24. `npm start` runs the production public website and intentionally does not expose the admin preview.
