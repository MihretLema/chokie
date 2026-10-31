import type { FieldConfig, ModuleConfig } from "./types";
import { services } from "@/lib/content";
const f = (
  key: string,
  label: string,
  type: FieldConfig["type"] = "text",
  extra: Partial<FieldConfig> = {},
): FieldConfig => ({ key, label, type, ...extra });
const publication = ["Draft", "Published", "Archived"];
const seo = [
  f("seoTitle", "SEO title", "text", {
    max: 60,
    section: "Search engine visibility",
  }),
  f("seoDescription", "SEO description", "textarea", { max: 160 }),
];
const status = f("status", "Publication status", "select", {
  options: publication,
  required: true,
  section: "Publishing",
});
const titleSlug = [
  f("title", "Title", "text", { required: true, section: "Content" }),
  f("slug", "URL slug", "slug", { required: true }),
];
const related = f("relatedServices", "Related services", "multi", {
  options: services.map((s) => s.title),
});
const images = f("image", "Hero image", "image", { section: "Visuals" });
const order = f("order", "Display order", "number");
const standardColumns = [
  { key: "title", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "status", label: "Status" },
  { key: "order", label: "Order" },
  { key: "updatedAt", label: "Last updated" },
];
const publicationFields = [
  f("approved", "Publication approved", "toggle", {
    hint: "Demo approval only. No public changes are made.",
  }),
  status,
];
const customerFields = [
  f("name", "Full name", "text", {
    required: true,
    section: "Customer information",
  }),
  f("email", "Email", "email", { required: true }),
  f("phone", "Phone"),
  f("organization", "Organization"),
];
const notes = [
  f("notes", "Internal notes", "textarea", { section: "Team workspace" }),
  f("assigned", "Assigned staff member", "select", {
    options: [
      "Unassigned",
      "Alex Morgan (demo)",
      "Jordan Lee (demo)",
      "Sam Taylor (demo)",
    ],
  }),
];
const customerColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "organization", label: "Organization" },
  { key: "category", label: "Service / program" },
  { key: "date", label: "Submitted" },
  { key: "status", label: "Status" },
];
const inquiryStatuses = [
  "New",
  "In Review",
  "Contacted",
  "Resolved",
  "Archived",
];
export const modules: Record<string, ModuleConfig> = {
  services: {
    key: "services",
    title: "Services",
    singular: "Service",
    description:
      "Shape your expertise. Keep every service clear, useful, and easy to discover.",
    group: "Website management",
    fields: [
      ...titleSlug,
      f("short", "Short description", "textarea", { required: true, max: 240 }),
      f("description", "Full description", "textarea", { required: true }),
      images,
      f("icon", "Service icon", "select", {
        options: [
          "BriefcaseBusiness",
          "ShieldCheck",
          "Network",
          "Workflow",
          "KeyRound",
          "Package",
          "Camera",
          "Phone",
          "Headset",
        ],
      }),
      f("features", "Features", "list", { section: "Capabilities & benefits" }),
      f("benefits", "Benefits", "list"),
      related,
      ...seo,
      order,
      status,
    ],
    columns: [{ key: "icon", label: "Icon" }, ...standardColumns],
    statuses: publication,
  },
  solutions: {
    key: "solutions",
    title: "Solutions",
    singular: "Solution",
    description:
      "Connect business needs with the right technology and services.",
    group: "Website management",
    fields: [
      ...titleSlug,
      f("short", "Short description", "textarea", { required: true }),
      f("description", "Full description", "textarea"),
      images,
      related,
      order,
      ...seo,
      status,
    ],
    columns: standardColumns,
    statuses: publication,
  },
  training: {
    key: "training",
    title: "Training programs",
    singular: "Training program",
    description:
      "Manage professional learning. Unprovided schedules and fees stay blank.",
    group: "Website management",
    fields: [
      f("title", "Training title", "text", {
        required: true,
        section: "Program overview",
      }),
      f("category", "Category", "select", {
        options: ["CISSP", "PMP", "CISA", "CISM"],
        required: true,
      }),
      f("description", "Description", "textarea", { required: true }),
      f("objectives", "Learning objectives", "list"),
      f("audience", "Target audience", "textarea"),
      f("duration", "Duration", "text", { section: "Delivery & availability" }),
      f("mode", "Delivery mode", "select", {
        options: ["Not provided", "Online", "In person", "Hybrid"],
      }),
      f("startDate", "Start date", "date"),
      f("deadline", "Registration deadline", "date"),
      f("status", "Availability status", "select", {
        options: ["Not provided", "Open", "Closed", "Coming soon"],
      }),
      f("image", "Training image", "image"),
    ],
    columns: [
      { key: "title", label: "Training title" },
      { key: "category", label: "Category" },
      { key: "duration", label: "Duration" },
      { key: "mode", label: "Delivery mode" },
      { key: "status", label: "Availability" },
      { key: "registrations", label: "Registrations" },
    ],
    statuses: ["Not provided", "Open", "Closed", "Coming soon"],
  },
  partners: {
    key: "partners",
    title: "Technology partners",
    singular: "Partner",
    description:
      "Manage technology references with verification and publication approval.",
    group: "Website management",
    fields: [
      f("title", "Partner name", "text", { required: true }),
      f("description", "Description", "textarea"),
      f("image", "Partner logo", "image"),
      f("website", "Official website", "url"),
      f("category", "Category", "select", {
        options: [
          "Software",
          "Security",
          "Networking",
          "Infrastructure",
          "Technology",
        ],
      }),
      order,
      f("verification", "Verification status", "select", {
        options: ["Unverified", "Verified"],
      }),
      ...publicationFields,
    ],
    columns: [
      { key: "title", label: "Partner name" },
      { key: "image", label: "Logo" },
      { key: "category", label: "Category" },
      { key: "website", label: "Website" },
      { key: "verification", label: "Verification" },
      { key: "status", label: "Publication" },
    ],
    statuses: publication,
  },
  clients: {
    key: "clients",
    title: "Clients",
    singular: "Client",
    description:
      "Prepare client references. Publish only with documented approval.",
    group: "Website management",
    fields: [
      f("title", "Client name", "text", { required: true }),
      f("image", "Client logo", "image"),
      f("description", "Description", "textarea"),
      f("industry", "Industry"),
      f("website", "Website", "url"),
      ...publicationFields,
    ],
    columns: [
      { key: "title", label: "Client name" },
      { key: "industry", label: "Industry" },
      { key: "approved", label: "Approval" },
      { key: "status", label: "Status" },
    ],
    statuses: publication,
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    description:
      "A place for authentic customer feedback, with permission. No sample quotes are supplied.",
    group: "Website management",
    fields: [
      f("title", "Client name", "text", { required: true }),
      f("position", "Position"),
      f("organization", "Organization"),
      f("description", "Testimonial text", "textarea", { required: true }),
      f("image", "Client image", "image"),
      f("approved", "Approval confirmed", "toggle"),
      f("featured", "Featured", "toggle"),
      status,
    ],
    columns: [
      { key: "title", label: "Client name" },
      { key: "organization", label: "Organization" },
      { key: "approved", label: "Approval" },
      { key: "featured", label: "Featured" },
      { key: "status", label: "Status" },
    ],
    statuses: publication,
  },
  pages: {
    key: "pages",
    title: "Website pages",
    singular: "Page",
    description:
      "Compose structured sections that fit the public website’s component architecture.",
    group: "Website management",
    fields: [
      ...titleSlug,
      f("sections", "Content sections", "list", {
        hint: "Each entry is a section heading and its content.",
      }),
      images,
      ...seo,
      status,
    ],
    columns: standardColumns.filter((c) => c.key !== "order"),
    statuses: publication,
  },
  inquiries: {
    key: "inquiries",
    title: "Contact inquiries",
    singular: "Inquiry",
    description:
      "Bring every conversation into focus. All records below are synthetic examples.",
    group: "Customer management",
    customer: true,
    fields: [
      ...customerFields,
      f("subject", "Subject", "text", {
        required: true,
        section: "Inquiry details",
      }),
      f("category", "Interested service", "select", {
        options: services.map((s) => s.title),
      }),
      f("message", "Full message", "textarea", { required: true }),
      f("date", "Submission date", "date"),
      f("status", "Status", "select", { options: inquiryStatuses }),
      ...notes,
    ],
    columns: customerColumns,
    statuses: inquiryStatuses,
  },
  consultations: {
    key: "consultations",
    title: "Consultation requests",
    singular: "Consultation",
    description:
      "Coordinate next steps, contact preferences, and conversations with your team.",
    group: "Customer management",
    customer: true,
    fields: [
      ...customerFields,
      f("category", "Requested service", "select", {
        options: services.map((s) => s.title),
      }),
      f("preferredDate", "Preferred contact date", "date"),
      f("date", "Request date", "date"),
      f("message", "Request details", "textarea"),
      f("status", "Status", "select", {
        options: ["New", "Contacted", "Scheduled", "Completed", "Cancelled"],
      }),
      ...notes,
    ],
    columns: [
      ...customerColumns.slice(0, 6),
      { key: "preferredDate", label: "Preferred date" },
      ...customerColumns.slice(6),
    ],
    statuses: ["New", "Contacted", "Scheduled", "Completed", "Cancelled"],
  },
  registrations: {
    key: "registrations",
    title: "Training registrations",
    singular: "Training inquiry",
    description:
      "Review synthetic training inquiries by program, organization, and status.",
    group: "Customer management",
    customer: true,
    fields: [
      ...customerFields,
      f("category", "Selected training", "select", {
        options: ["CISSP", "PMP", "CISA", "CISM"],
      }),
      f("date", "Date submitted", "date"),
      f("message", "Inquiry details", "textarea"),
      f("status", "Status", "select", {
        options: ["New", "In Review", "Contacted", "Closed"],
      }),
      ...notes,
    ],
    columns: customerColumns,
    statuses: ["New", "In Review", "Contacted", "Closed"],
  },
  support: {
    key: "support",
    title: "Support tickets",
    singular: "Ticket",
    description:
      "A focused workspace for resolving issues together. Conversations are local demonstrations.",
    group: "Customer management",
    customer: true,
    fields: [
      ...customerFields,
      f("subject", "Issue subject", "text", {
        required: true,
        section: "Ticket details",
      }),
      f("message", "Ticket description", "textarea", { required: true }),
      f("category", "Service", "select", {
        options: services.map((s) => s.title),
      }),
      f("priority", "Priority", "select", {
        options: ["Low", "Normal", "High", "Critical"],
      }),
      f("status", "Status", "select", {
        options: [
          "New",
          "Open",
          "In Progress",
          "Waiting for Customer",
          "Resolved",
          "Closed",
        ],
      }),
      f("date", "Created date", "date"),
      ...notes,
    ],
    columns: [
      { key: "id", label: "Ticket ID" },
      { key: "name", label: "Customer" },
      { key: "subject", label: "Subject" },
      { key: "category", label: "Service" },
      { key: "priority", label: "Priority" },
      { key: "assigned", label: "Agent" },
      { key: "status", label: "Status" },
      { key: "date", label: "Created" },
    ],
    statuses: [
      "New",
      "Open",
      "In Progress",
      "Waiting for Customer",
      "Resolved",
      "Closed",
    ],
  },
  users: {
    key: "users",
    title: "Users and roles",
    singular: "Demo user",
    description:
      "Explore team management and role design. Permissions are illustrative and are not enforced.",
    group: "Administration",
    fields: [
      f("name", "Full name", "text", { required: true }),
      f("email", "Email", "email", { required: true }),
      f("role", "Role", "select", {
        options: ["Super Admin", "Content Manager", "Support Agent", "Viewer"],
        required: true,
      }),
      f("status", "Status", "select", { options: ["Active", "Inactive"] }),
      f("lastLogin", "Last login", "text", {
        hint: "Synthetic preview value; not an authentication log.",
      }),
    ],
    columns: [
      { key: "name", label: "Full name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
      { key: "lastLogin", label: "Last login" },
    ],
    statuses: ["Active", "Inactive"],
  },
};
export const documentFields: Record<string, FieldConfig[]> = {
  homepage: [
    f("headline", "Hero headline", "text", { required: true, section: "Hero" }),
    f("description", "Hero description", "textarea", { required: true }),
    f("image", "Hero image", "image"),
    f("primaryText", "Primary CTA text"),
    f("primaryLink", "Primary CTA link", "url"),
    f("secondaryText", "Secondary CTA text"),
    f("secondaryLink", "Secondary CTA link", "url"),
    f("aboutTitle", "About heading", "text", { section: "About section" }),
    f("aboutText", "About introduction", "textarea"),
    f("featuredServices", "Featured services", "multi", {
      options: services.map((s) => s.title),
    }),
    f("featuredSolutions", "Featured solutions", "list"),
    f("partnerTitle", "Partner section heading", "text", {
      section: "Partners & training",
    }),
    f("partnerDescription", "Partner section description", "textarea"),
    f("trainingTitle", "Training section heading"),
    f("trainingDescription", "Training section description", "textarea"),
    f("ctaTitle", "Consultation CTA heading", "text", {
      section: "Consultation CTA",
    }),
    f("ctaText", "Consultation CTA description", "textarea"),
    f("ctaButton", "Consultation CTA button"),
    f("ctaLink", "Consultation CTA link", "url"),
  ],
  about: [
    f("title", "Page heading", "text", { required: true }),
    f("description", "Company overview", "textarea", { required: true }),
    f("vision", "Vision", "textarea", { required: true }),
    f("mission", "Mission", "textarea", { required: true }),
    f("values", "Core values", "list"),
    f("image", "Featured image", "image"),
    ...seo,
  ],
  profile: [
    f("image", "Profile picture", "image"),
    f("name", "Full name", "text", { required: true }),
    f("email", "Email", "email", { required: true }),
    f("role", "Role", "select", {
      options: ["Super Admin", "Content Manager", "Support Agent", "Viewer"],
    }),
    f("language", "Language", "select", { options: ["English"] }),
    f("timezone", "Time zone"),
  ],
};
export const settingsTabs: Record<string, FieldConfig[]> = {
  General: [
    f("company", "Company name", "text", { required: true }),
    f("description", "Company description", "textarea"),
    f("website", "Website URL", "url"),
    f("timezone", "Time zone"),
    f("language", "Default language", "select", { options: ["English"] }),
  ],
  Branding: [
    f("image", "Company logo", "image"),
    f("favicon", "Favicon", "image"),
    f("primaryColor", "Primary color", "color"),
    f("secondaryColor", "Secondary color", "color"),
    f("footer", "Footer branding", "textarea"),
  ],
  Contact: [
    f("email", "Company email", "email"),
    f("phone", "Phone number"),
    f("address", "Office address", "textarea"),
    f("hours", "Business hours"),
    f("map", "Map link", "url"),
  ],
  "Social media": [
    f("linkedin", "LinkedIn", "url"),
    f("facebook", "Facebook", "url"),
    f("youtube", "YouTube", "url"),
    f("x", "X", "url"),
    f("other", "Other approved platform", "url"),
  ],
  Notifications: [
    f("inquiries", "Inquiry notifications", "toggle"),
    f("consultations", "Consultation notifications", "toggle"),
    f("training", "Training notifications", "toggle"),
    f("support", "Support ticket notifications", "toggle"),
  ],
  SEO: [
    f("seoTitle", "Default title", "text", { max: 60 }),
    f("seoDescription", "Default description", "textarea", { max: 160 }),
    f("image", "Social sharing image", "image"),
  ],
};
export const seoFields = [
  f("seoTitle", "SEO title", "text", { required: true, max: 60 }),
  f("seoDescription", "Meta description", "textarea", {
    required: true,
    max: 160,
  }),
  f("canonical", "Canonical URL", "url"),
  f("ogTitle", "Open Graph title"),
  f("ogDescription", "Open Graph description", "textarea"),
  f("image", "Open Graph image", "image"),
  f("index", "Allow indexing", "toggle"),
];
