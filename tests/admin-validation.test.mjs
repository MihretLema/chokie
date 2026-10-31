import test from "node:test";
import assert from "node:assert/strict";
import { editorSchema } from "../src/lib/admin/validation.ts";

test("partner publication requires both verification and approval", () => {
  const schema = editorSchema([], "partners");
  assert.equal(
    schema.safeParse({
      status: "Published",
      verification: "Unverified",
      approved: false,
    }).success,
    false,
  );
  assert.equal(
    schema.safeParse({
      status: "Published",
      verification: "Verified",
      approved: false,
    }).success,
    false,
  );
  assert.equal(
    schema.safeParse({
      status: "Published",
      verification: "Verified",
      approved: true,
    }).success,
    true,
  );
  assert.equal(
    schema.safeParse({
      status: "Draft",
      verification: "Unverified",
      approved: false,
    }).success,
    true,
  );
});
test("client and testimonial publication is approval gated", () => {
  for (const module of ["clients", "testimonials"]) {
    assert.equal(
      editorSchema([], module).safeParse({
        status: "Published",
        approved: false,
      }).success,
      false,
    );
    assert.equal(
      editorSchema([], module).safeParse({
        status: "Published",
        approved: true,
      }).success,
      true,
    );
  }
});
test("required fields, slugs, and metadata limits are validated", () => {
  const schema = editorSchema([
    { key: "title", label: "Title", required: true },
    { key: "slug", label: "Slug", type: "slug", required: true },
    { key: "seoTitle", label: "SEO title", max: 60 },
  ]);
  assert.equal(
    schema.safeParse({ title: " ", slug: "Bad Slug", seoTitle: "x".repeat(61) })
      .success,
    false,
  );
  assert.equal(
    schema.safeParse({
      title: "Consulting",
      slug: "it-consulting",
      seoTitle: "IT Consulting",
    }).success,
    true,
  );
});
test("training deadlines must be valid and precede their start date", () => {
  const schema = editorSchema([
    { key: "startDate", label: "Start", type: "date" },
    { key: "deadline", label: "Deadline", type: "date" },
  ]);
  assert.equal(
    schema.safeParse({ startDate: "2026-11-10", deadline: "2026-11-11" })
      .success,
    false,
  );
  assert.equal(
    schema.safeParse({ startDate: "2026-11-10", deadline: "2026-11-01" })
      .success,
    true,
  );
  assert.equal(
    schema.safeParse({ startDate: "2026-02-30", deadline: "" }).success,
    false,
  );
});
test("links allow internal paths and web URLs, and reject unsafe schemes", () => {
  const schema = editorSchema([{ key: "link", label: "Link", type: "url" }]);
  for (const link of ["javascript:alert(1)", "//example.com", "/\\example.com"])
    assert.equal(schema.safeParse({ link }).success, false);
  for (const link of ["/contact", "https://example.com/contact", ""])
    assert.equal(schema.safeParse({ link }).success, true);
});
