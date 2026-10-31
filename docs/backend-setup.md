# Backend setup and operations

Use Node.js 24 and PostgreSQL 18. Never commit `.env` or pass passwords in chat. `.env.example` lists configuration names without secrets.

## This Windows checkout

The ignored `.env` already contains locally generated secrets and separate owner/runtime connections. Start the dedicated local database if necessary:

```powershell
npm run db:local
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:grant
npm run admin:bootstrap
npm run dev -- --port 3001
```

The bootstrap command uses `BOOTSTRAP_ADMIN_EMAIL=mihret4375@gmail.com`, prompts twice with input hidden, and refuses to create a second initial administrator. Choose 12–128 characters. Open `/admin/login`, sign in, change the initial password, then sign in again. Use authenticated user management or password reset for subsequent accounts. Password reset requires working email delivery.

`db:local` uses the installed PostgreSQL binaries and creates/starts its own ignored `.local/postgres` cluster on loopback port 55432. It does not alter another PostgreSQL installation's databases. The app uses `chokie`; tests use `chokie_test`.

## New environment

Copy `.env.example` to `.env`. Create a database owner and a separate restricted runtime login, then set `MIGRATION_DATABASE_URL` and `DATABASE_URL` accordingly. Generate a random AUTH_SECRET of at least 32 characters and a random 32-byte hex OUTBOX_ENCRYPTION_KEY. Retain the encryption key while queued jobs exist. Set APP_URL and AUTH_URL to the same origin and NEXT_PUBLIC_SITE_URL to the canonical public origin. Production requires HTTPS. Do not reuse development secrets.

Install using `npm ci`, generate the Prisma client, deploy migrations with owner credentials, seed, apply runtime grants, and bootstrap the first administrator. Apply runtime grants after migrations introducing new tables. Use the owner URL only for migration/administrative commands; supply only the runtime URL to the web service. Back up and rehearse restoration of both PostgreSQL and object storage before production use. The supplied Dockerfile runs the application as a non-root user; Compose definitions are optional and unverified locally.

## Email and media

Set EMAIL_PROVIDER to `smtp` or `resend` and configure EMAIL_FROM plus ADMIN_NOTIFICATION_EMAIL. SMTP requires host/port and any required user/password; production requires secure transport. Resend uses EMAIL_API_KEY and a verified sender. `disabled` retains queued jobs and does not claim delivery.

Run `npm run worker:start` as a separately supervised process with the same database, encryption, email, and storage configuration. `worker:once` processes a bounded batch. Monitor failed jobs through the protected outbox API, correct configuration, then retry. Keep secrets/payloads out of operational logs.

Configure S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and optionally S3_ENDPOINT/S3_FORCE_PATH_STYLE for compatible providers. Keep the bucket private, enable provider public-access blocking, and restrict credentials to the bucket operations required by the service. Website images become downloadable only after approval; ticket attachments remain private. Downloads use expiring signed URLs. File maximum is 5 MB; images are JPEG/PNG/WebP, with PDF also allowed for private ticket attachments. No local filesystem fallback is used.

## Security and maintenance

Sessions use HttpOnly SameSite=Strict cookies, Secure in production; sliding expiry is eight hours with an absolute 24-hour cap. Password changes/reset and role/status changes revoke sessions. Public registration is disabled. Permission checks reload current account state. Same-origin headers are required for write APIs. TRUST_PROXY defaults to false; enable only behind a proxy that replaces untrusted forwarding headers. Without this, rate limits share the direct-client bucket and need deployment-specific review.

Audit metadata excludes passwords, tokens, message bodies, and outbox payloads. Audit rows cannot be updated/deleted by normal application operations. Do not enable verbose request/body logging in the reverse proxy. Admin reset tokens use URL fragments and are removed from browser history after loading.

Set RETENTION_DAYS only after deciding a business policy. `retention:preview` is read-only; `retention:apply` archives eligible business records and removes expired ephemeral security records. Soft archival is not a personal-data erasure mechanism. MFA, antivirus scanning, live provider qualification, load testing, incident response, backup scheduling, and deployment monitoring remain operational work.

## Verification

```powershell
npm run typecheck
npm test
npm run build
# With development server running at 127.0.0.1:3001:
npm run test:browser
```

Backend tests require TEST_DATABASE_URL on loopback with a `chokie_test` database name, distinct from the application URL. They intentionally clear only that isolated test database and create synthetic fixture accounts. They start local SMTP and S3 fixtures and never send external email. Browser tests use installed Microsoft Edge and do not need production credentials. Do not point tests at a database containing data you need.
