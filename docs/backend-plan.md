# Phase 3 implementation plan

Review: Next.js 16.4.3 App Router; public routes in `(public)`; separate admin layout; Phase 2 has typed browser-tab demo storage. No existing database, APIs, or real authentication. Existing UI fields and publication/approval workflows will be preserved.

1. Configure Docker Compose and a separate local PostgreSQL cluster, validated environment settings, Prisma 7 and its PostgreSQL adapter.
2. Normalize authentication/RBAC, company content, business records, private media, notifications, outbox, rate limits, and immutable audit trails. Generate and execute migrations against dedicated application and test databases.
3. Idempotently seed existing company content and permissions only. Bootstrap the first administrator through an environment-secret command; never create default credentials.
4. Use Better Auth database sessions and Argon2id, disable public signup, and limit the authentication API surface. Implement hashed single-use password-reset tokens, revocation, account checks, database rate limiting, CSRF/origin checks, and server-side permissions.
5. Separate Zod schemas, repositories, transactional services, safe response projections, and Next.js REST handlers. Only published/approved content is public; staff APIs authorize before data access.
6. Commit business records, audit events, and outbox jobs atomically. Use retryable encrypted email jobs and signature-validated private S3 uploads.
7. Verify with isolated PostgreSQL, Vitest API/auth/database tests, browser authentication checks, production builds, API documentation, and an accurate handoff report.

Authentication is integrated now. The existing dashboard remains visually unchanged and explicitly a separate demonstration until Phase 4; production does not render its demo repository. Real records and metrics come from protected APIs.
