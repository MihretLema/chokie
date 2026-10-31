# Phase 3 backend handoff

Verified locally on 2026-10-27. The backend is implemented; deployment configuration and the first administrator's private password remain operator steps. Phase 4 UI integration has not started.

## Implemented

- PostgreSQL with Prisma 7, normalized content/business models, foreign keys, unique constraints, publication checks, append-only audit enforcement, and soft archival.
- Better Auth database sessions with Argon2id passwords, disabled public registration, forced initial password change, reset tokens, session revocation, and four fixed permission roles.
- Public publication-filtered content APIs and protected administrative CRUD for services, solutions, training, partners, clients, testimonials, case studies, pages, SEO, and settings.
- Persistent contact, consultation, training inquiry, and support ticket workflows, staff assignment, internal notes, customer replies, and ticket history.
- S3-compatible media storage with signature/type/size validation, approval, private ticket attachments, short-lived signed downloads, and queued deletion.
- Encrypted transactional email outbox with SMTP/Resend transports, retries, leases, staff notifications, real dashboard queries, audit events, and explicit retention/archive commands.
- Server-side route guards, fresh permission checks, bounded strict input validation, origin checks, database rate limits, safe error envelopes, security headers, and nonce-based admin CSP.

## Database verification

Executed `202610270001_initial` and `202610270002_integrity` against the local application database and a separate test database. `prisma migrate status` reports up to date; schema drift check reports no difference. Runtime and migration credentials are separate. The local PostgreSQL cluster binds to loopback port 55432.

The idempotent seed installs system roles/permissions and profile-derived company content: nine services, four training programs, six solutions, home/about sections, mission, vision, values, and basic branding. Partner/client entries remain drafts pending approval. No production customers, testimonials, business statistics, or administrator passwords are fabricated.

## Verification results

- TypeScript check: passed.
- Optimized Next.js production build: passed, including 72 concrete API route handlers.
- Unit validation tests: 5 passed.
- Backend integration tests: 35 passed against isolated PostgreSQL, real local SMTP, and local S3-compatible fixtures. Coverage includes authentication, authorization, expired/revoked sessions, reset tokens, database integrity/rollback, publication approval, content CRUD, inquiries, ticket state/history, notification isolation, media upload/download/privacy, outbox failure/retry, and actual SMTP delivery.
- Playwright with installed Microsoft Edge: 2 passed, covering anonymous admin redirects, hydrated invalid-login handling, protected API rejection, incomplete reset links, and public content availability. Authenticated workflows are covered by backend integration tests; a full authenticated UI suite remains for Phase 4.
- Production dependency audit: zero reported vulnerabilities at verification time.

Initial integration failures were corrected (Prisma SEO creation and immutable redirect headers). A browser test selector was corrected to distinguish the form alert from Next's route announcer. No failing checks remain in these suites. PostgreSQL emits a driver deprecation notice about concurrent queries; it does not fail tests and should be rechecked before upgrading to pg 9.

## Configuration still required

The intended initial Super Admin email is `mihret4375@gmail.com`. Run `npm run admin:bootstrap` in a local interactive terminal to supply and confirm the password without displaying it. No administrator has been created automatically. First sign-in requires a password change and then another sign-in.

Production SMTP or Resend credentials, sender verification, notification recipient, private S3 bucket/credentials, production HTTPS origins, secrets management, backups, TLS/reverse proxy, monitoring, and worker scheduling must be configured before deployment. Email is currently disabled locally; queued messages are retained. External provider delivery was tested through local fixtures, not live accounts. Docker definitions are supplied but were not executed because Docker is unavailable on this machine. Optional MFA is not enabled. Uploads validate signatures but do not include antivirus scanning.

## Phase 4 boundary

The public pages still use their original content adapter and frontend-only forms. Development admin screens retain clearly labeled Phase 2 browser demo state behind real authentication. Production renders an authenticated backend-ready screen instead of demo statistics. Connect these screens to the documented APIs in Phase 4, replace demo state, add authenticated end-to-end UI tests, and review accessibility and workflow behavior. Original branding and logo are preserved.

See [backend setup](backend-setup.md) and [API contracts](api.md).
