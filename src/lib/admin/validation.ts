import { z } from "zod";
import type { FieldConfig } from "./types";
const value = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
]);
export function editorSchema(fields: FieldConfig[], module?: string) {
  return z.record(z.string(), value).superRefine((values, ctx) => {
    for (const field of fields) {
      const raw = values[field.key];
      const str = String(raw ?? "").trim();
      const issue = (message: string) =>
        ctx.addIssue({ code: "custom", path: [field.key], message });
      if (
        field.required &&
        (raw === undefined ||
          str === "" ||
          (Array.isArray(raw) && raw.length === 0))
      )
        issue(field.label + " is required.");
      if (!str) continue;
      if (field.type === "email" && !z.email().safeParse(str).success)
        issue("Enter a valid email address.");
      if (field.type === "date" && !z.iso.date().safeParse(str).success)
        issue("Enter a valid calendar date.");
      if (
        field.type === "url" &&
        !(
          (str.startsWith("/") &&
            !str.startsWith("//") &&
            !str.includes("\\")) ||
          /^https?:\/\/[^\s]+$/.test(str)
        )
      )
        issue("Use an http(s) URL or an internal path such as /contact.");
      if (field.type === "slug" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str))
        issue("Use lowercase letters, numbers, and single hyphens.");
      if (field.max && str.length > field.max)
        issue(`Use ${field.max} characters or fewer.`);
      if (
        field.type === "number" &&
        (Number(raw) < 0 || !Number.isInteger(Number(raw)))
      )
        issue("Enter a whole number of zero or more.");
      if (
        field.type === "select" &&
        field.options &&
        !field.options.includes(str)
      )
        issue("Select a valid option.");
      if (field.type === "color" && !/^#[0-9a-f]{6}$/i.test(str))
        issue("Use a six-digit hex color.");
    }
    if (
      values.startDate &&
      values.deadline &&
      String(values.deadline) > String(values.startDate)
    )
      ctx.addIssue({
        code: "custom",
        path: ["deadline"],
        message: "The deadline must be on or before the start date.",
      });
    if (
      values.status === "Published" &&
      ["partners", "clients", "testimonials"].includes(module || "")
    ) {
      if (!values.approved)
        ctx.addIssue({
          code: "custom",
          path: ["approved"],
          message:
            "Approval is required before marking this content published, including in the demo.",
        });
      if (module === "partners" && values.verification !== "Verified")
        ctx.addIssue({
          code: "custom",
          path: ["verification"],
          message: "Verify the partner before marking it published.",
        });
    }
  });
}
