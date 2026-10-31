# Phase 3 API contracts

All paths are relative to APP_URL. JSON responses use `{success:true,data,message}` or `{success:false,error:{code,message,fields?},requestId}`. Paginated collections return `data.items` and `data.pagination` with page, pageSize and total; content collections also include totalPages. Settings return an array. Successful creates return 201; other successful operations return 200. Validation is 422, unauthenticated 401, denied 403, missing 404, conflicts 409, throttled 429. Unexpected failures return generic 500 with a request ID.

Write requests require the exact APP_URL Origin header and JSON Content-Type, except multipart uploads. Administrative requests require the session cookie obtained from sign-in. Browser fetch sends same-origin cookies automatically. Never store session tokens in localStorage. JSON bodies are bounded to 64 KB; input schemas reject unsupported fields. IDs are UUIDs; slugs are lowercase hyphenated text. Dates use ISO date/datetime strings. See `src/server/validators/schemas.ts` for exact request fields, limits, and enums.

## Content

For each resource `services`, `solutions`, `training`, `partners`, `clients`, `testimonials`, `case-studies`, `pages`:

| Endpoint | Methods | Contract |
| --- | --- | --- |
| `/api/{resource}` | GET | Published, non-deleted collection only |
| `/api/{resource}/{slug}` | GET | Published item or 404 |
| `/api/admin/{resource}` | GET, POST | Authorized collection / create |
| `/api/admin/{resource}/{id}` | GET, PATCH, DELETE | Read / partial update / soft archive |

List queries accept page (default 1), pageSize (default 20, max 100), search, sort, direction. Admin content additionally accepts status. Sort supports createdAt, updatedAt, displayOrder, and the resource's title/name. Public default order is displayOrder ascending. Drafts and unapproved partner/client/testimonial/case-study content are excluded even when searched by slug. Publishing partners requires both verification and approval; related clients and public media must also be approved. Content roles cannot grant approval.

Core service fields are title, slug, shortDescription, description, features[], benefits[], imageId, status, displayOrder, seo. Solutions add serviceIds[]. Training has program/category/availability fields. Pages have structured sections[]. Partners/clients use name, slug, description with explicit approval fields. Status is DRAFT, PUBLISHED, or ARCHIVED. Rich descriptions are sanitized. SEO supports title, description, canonicalUrl, ogTitle, ogDescription, ogImageId, indexable. See the strict schemas for each resource rather than sending a generic record.

`GET /api/homepage` and `/api/about` resolve seeded home/about pages. Admin aliases support GET/PATCH. `GET /api/seo/{slug}?resource=pages` returns public SEO; resource can select another content type. `/api/admin/seo/{resource}/{id}` supports GET/PATCH with SEO permissions plus resource permissions.

`GET /api/settings` and `/api/settings/{key}` expose allowlisted published settings. `/api/admin/settings` supports GET/POST/PATCH with `{key,value,status?}`. Keys are company, branding, contact, social, footer, seo, notifications. Notification settings are administrative only.

## Public submissions

| POST endpoint | Required fields |
| --- | --- |
| `/api/contact` | fullName, email, subject, message (20+ chars), privacyConsent:true |
| `/api/consultations` | fullName, email, projectDescription (20+ chars) |
| `/api/training-inquiries` | fullName, email, programId, message (10+ chars) |
| `/api/support-tickets` | fullName, email, serviceCategory, subject, description (20+ chars) |

Optional personal fields and anti-spam fields are defined in the schemas. The honeypot website must be empty. Each accepted submission returns an opaque reference and queued notification status. Saved records are durable even when delivery fails. There is no public endpoint to retrieve private submissions or ticket conversations by reference.

## Staff workflows

`/api/admin/inquiries`, `/consultations`, `/registrations`, `/tickets` support GET lists; their `/{id}` endpoints support GET/PATCH. Lists accept pagination/search/status. Updates accept resource-specific status, assignedToId (nullable), and note; tickets additionally accept priority. Only active appropriately authorized staff can be assigned. Ticket transitions are enforced and recorded. `/api/admin/tickets/{id}/messages` POST accepts `{body,internal:false}`. Internal notes never queue customer email; external replies do. Attachments are managed through media endpoints.

`GET /api/admin/dashboard` calculates actual counts and dated chart series, with optional from/to filters. Empty datasets remain empty. `GET /api/admin/audit-logs` (alias activity) requires audit.read. `GET /api/admin/notifications` returns only the current user's notifications; PATCH `/{id}` with `{read:true|false}` updates that user's record. `/api/admin/outbox` GET omits encrypted payloads; POST `/{id}/retry` requeues an eligible failed job.

## Authentication and users

| Endpoint | Request |
| --- | --- |
| POST `/api/auth/sign-in/email` | `{email,password}` |
| POST `/api/auth/sign-out` | Session cookie |
| GET `/api/auth/get-session` | Safe current session projection |
| POST `/api/auth/password/request` | `{email}`; generic eligible-account response |
| POST `/api/auth/password/reset` | `{token,password}`; single-use token, 30-minute expiry |
| POST `/api/auth/password/change` | `{currentPassword,newPassword}`; revokes sessions |
| GET/POST `/api/admin/users` | List or invite `{name,email,roles:[...]}` |
| GET/PATCH `/api/admin/users/{id}` | Safe user details / roles, status, name, email |

Public signup and unexposed authentication-library endpoints return 404. Roles are Super Admin, Content Manager, Support Agent, Viewer. Users must be ACTIVE and authorized. Invitations queue reset instructions without returning a password. The last active Super Admin cannot be disabled or demoted. Passwords require 12–128 characters. Forced password changes restrict normal APIs until changed.

## Media and health

`GET/POST /api/admin/media`: list or multipart upload containing file, purpose (WEBSITE/TICKET), visibility (PUBLIC/PRIVATE), and ticketId for ticket assets. PATCH `/api/admin/media/{id}` manages approved metadata; DELETE soft-deletes and queues object removal. GET `/api/admin/media/{id}/download` returns an authorized signed redirect. GET `/api/media/{id}` redirects only approved, public, ready website assets. Private ticket attachment access requires ticket permissions. Signed URLs expire after 60 seconds.

`GET /api/health` checks database reachability without returning credentials or database details.

## Integration example

```js
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    fullName: 'Customer name', email: 'customer@example.com',
    subject: 'Network assessment',
    message: 'Please contact us about an office network assessment.',
    privacyConsent: true
  })
});
const result = await response.json();
// Show the returned reference only after response.ok && result.success.
```

Phase 4 must bind the existing forms/admin views to these endpoints and display server validation/errors and queued-versus-delivered states accurately.
