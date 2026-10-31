/** Development fixtures only. Customer identities, dates and activity are synthetic. */
import { services, solutions, training, partners, values } from "@/lib/content";
import type { AdminRecord, DemoState, EditorValues } from "./types";
const updatedAt = "2026-10-27T09:30:00-07:00";
const record = (id: string, values: EditorValues): AdminRecord => ({
  id,
  updatedAt,
  values,
});
const names = [
  "Alex Rivera",
  "Morgan Reed",
  "Taylor Brooks",
  "Casey Quinn",
  "Jamie Parker",
  "Avery Lane",
  "Riley Chen",
  "Drew Ellis",
];
const organizations = [
  "Example Studio",
  "Sample Systems",
  "Demo Industries",
  "Example Ventures",
];
export const chartData = [
  { day: "Mon", inquiries: 12, consultations: 5 },
  { day: "Tue", inquiries: 19, consultations: 8 },
  { day: "Wed", inquiries: 14, consultations: 6 },
  { day: "Thu", inquiries: 26, consultations: 11 },
  { day: "Fri", inquiries: 21, consultations: 9 },
  { day: "Sat", inquiries: 10, consultations: 4 },
  { day: "Sun", inquiries: 16, consultations: 7 },
];
export const permissions: Record<string, string[]> = {
  "Super Admin": [
    "Manage demo content",
    "Manage demo customer records",
    "Manage demo users and settings",
  ],
  "Content Manager": [
    "Manage website content",
    "Manage media and SEO",
    "View inquiries",
  ],
  "Support Agent": [
    "View and update support tickets",
    "Add internal notes",
    "View customer inquiries",
  ],
  Viewer: ["Read-only access design"],
};
export function createMockState(): DemoState {
  if (process.env.NODE_ENV !== "development")
    throw new Error("Demo fixtures are only available in development.");
  const customer = (kind: string, count: number) =>
    Array.from({ length: count }, (_, i) =>
      record(`${kind.toUpperCase()}-${String(i + 1).padStart(3, "0")}`, {
        name: names[i % names.length],
        email: `person${i + 1}@example.com`,
        phone: "",
        organization: organizations[i % 4],
        category:
          kind === "registrations"
            ? training[i % 4].title
            : services[i % 9].title,
        subject: [
          "Network connectivity review",
          "Security assessment inquiry",
          "Infrastructure planning",
          "Software licensing question",
        ][i % 4],
        message:
          "Synthetic demonstration record. Please discuss the requirements and agree the next steps with the example customer.",
        date: `2026-10-${String(20 + (i % 8)).padStart(2, "0")}`,
        preferredDate: "",
        status:
          kind === "support"
            ? [
                "New",
                "Open",
                "In Progress",
                "Waiting for Customer",
                "Resolved",
                "Closed",
              ][i % 6]
            : kind === "consultations"
              ? ["New", "Contacted", "Scheduled", "Completed", "Cancelled"][
                  i % 5
                ]
              : ["New", "In Review", "Contacted", "Resolved", "Archived"][
                  i % 5
                ],
        priority: ["Normal", "High", "Low", "Critical"][i % 4],
        assigned: i % 2 ? "Alex Morgan (demo)" : "Unassigned",
        notes: "",
        timeline: [],
      }),
    );
  return {
    version: 2,
    collections: {
      services: services.map((s, i) =>
        record("service-" + s.slug, {
          title: s.title,
          slug: s.slug,
          short: s.short,
          description: s.benefit,
          features: s.capabilities,
          benefits: [s.benefit],
          image: "/data-center.jpg",
          icon: [
            "BriefcaseBusiness",
            "ShieldCheck",
            "Network",
            "Workflow",
            "KeyRound",
            "Package",
            "Camera",
            "Phone",
            "Headset",
          ][i],
          relatedServices: [],
          seoTitle: s.title,
          seoDescription: s.short,
          order: i + 1,
          status: "Published",
        }),
      ),
      solutions: solutions.map((s, i) =>
        record("solution-" + i, {
          title: s.title,
          slug: s.slug,
          short: s.text,
          description: s.text,
          image: "/architecture.jpg",
          relatedServices: [],
          order: i + 1,
          status: "Published",
        }),
      ),
      training: training.map((t, i) =>
        record("training-" + i, {
          title: t.title,
          category: t.title,
          description: t.description,
          objectives: [],
          audience: "",
          duration: "",
          mode: "Not provided",
          startDate: "",
          deadline: "",
          status: "Not provided",
          image: "",
          registrations: "Not provided",
        }),
      ),
      partners: partners.map(([title, category], i) =>
        record("partner-" + i, {
          title,
          category,
          description:
            "Referenced in the company profile. Current partnership status requires verification.",
          image: "",
          website: "",
          order: i + 1,
          verification: "Unverified",
          approved: false,
          status: "Draft",
        }),
      ),
      clients: [
        "AI",
        "GCS",
        "MINT",
        "TECHIN",
        "PMO",
        "Addis Ababa Airport Customs Branch Office",
      ].map((title, i) =>
        record("client-" + i, {
          title,
          image: "",
          description:
            "Profile reference; public usage approval has not been supplied.",
          industry: "",
          website: "",
          approved: false,
          status: "Draft",
        }),
      ),
      testimonials: [],
      pages: [
        ["Home", "home"],
        ["About Us", "about"],
        ["Services", "services"],
        ["Solutions", "solutions"],
        ["Training", "training"],
        ["Partners", "partners"],
        ["Contact", "contact"],
      ].map(([title, slug]) =>
        record("page-" + slug, {
          title,
          slug,
          seoTitle: title,
          seoDescription: "CHOKIE IT SOLUTIONS — " + title,
          sections: [],
          image: "",
          status: "Published",
        }),
      ),
      inquiries: customer("inquiries", 12),
      consultations: customer("consultations", 8),
      registrations: customer("registrations", 8).map((r, i) => ({
        ...r,
        values: {
          ...r.values,
          status: ["New", "In Review", "Contacted", "Closed"][i % 4],
        },
      })),
      support: customer("support", 10),
      users: [
        ["Alex Morgan", "Super Admin"],
        ["Jordan Lee", "Content Manager"],
        ["Sam Taylor", "Support Agent"],
        ["Robin Avery", "Viewer"],
      ].map(([name, role], i) =>
        record("user-" + i, {
          name,
          email: `team${i + 1}@example.com`,
          role,
          status: "Active",
          lastLogin: "Demo session",
        }),
      ),
      notifications: [
        [
          "New inquiry in your inbox",
          "Inquiries",
          "A synthetic infrastructure inquiry is ready for review.",
        ],
        [
          "A ticket needs a closer look",
          "Support",
          "Review the example high-priority ticket.",
        ],
        [
          "Content is ready to review",
          "Content",
          "Preview your sample service updates before marking them published.",
        ],
        [
          "Training interest received",
          "Training",
          "A sample CISSP inquiry is available in registrations.",
        ],
      ].map(([title, category, message], i) =>
        record("notification-" + i, {
          title,
          category,
          message,
          date: "2026-10-27",
          read: i > 1,
          status: i > 1 ? "Read" : "Unread",
        }),
      ),
    },
    documents: {
      homepage: {
        headline: "Empowering Your Business Through Innovative Technology",
        description:
          "CHOKIE IT SOLUTIONS delivers reliable technology consulting, cybersecurity, modern IT infrastructure, business automation, and enterprise solutions to help organizations grow with confidence.",
        image: "/data-center.jpg",
        primaryText: "Explore Our Services",
        primaryLink: "/services",
        secondaryText: "Get a Consultation",
        secondaryLink: "/contact",
        aboutTitle: "Your Trusted Technology Solutions Partner",
        aboutText:
          "Reliable technology solutions and a customer-focused approach.",
        featuredServices: services.slice(0, 3).map((s) => s.title),
        featuredSolutions: solutions.map((s) => s.title),
        partnerTitle: "A connected technology ecosystem",
        partnerDescription:
          "Technology names referenced in our company profile.",
        trainingTitle: "Build expertise. Unlock your next opportunity.",
        trainingDescription:
          "Professional training in security, auditing, management, and project delivery.",
        ctaTitle: "Ready to Transform Your Business with Technology?",
        ctaText:
          "Connect with CHOKIE IT SOLUTIONS to explore technology solutions tailored to your organization.",
        ctaButton: "Let’s Talk",
        ctaLink: "/contact",
        sectionOrder: [
          "Hero",
          "About",
          "Services",
          "Values",
          "Solutions",
          "Partners",
          "Training",
          "Consultation CTA",
        ],
        ...Object.fromEntries(
          [
            "Hero",
            "About",
            "Services",
            "Values",
            "Solutions",
            "Partners",
            "Training",
            "Consultation CTA",
          ].map((s) => ["show" + s, true]),
        ),
        status: "Draft",
      },
      about: {
        title: "Your Trusted Technology Solutions Partner",
        description:
          "CHOKIE IT SOLUTIONS provides technology consulting, cybersecurity, modern data centers and networking, business automation, software licensing, technology supply, surveillance, enterprise communications, and support.",
        vision: "To be a trusted and successful global technology company.",
        mission:
          "To provide innovative and reliable technology solutions to meet the needs of its clients or customers.",
        values,
        image: "/workspace.jpg",
      },
      profile: {
        name: "Alex Morgan",
        email: "administrator@example.com",
        role: "Super Admin",
        image: "",
        language: "English",
        timezone: "America/Los_Angeles",
      },
      "settings-General": {
        company: "CHOKIE IT SOLUTIONS",
        description: "Innovative and reliable technology solutions.",
        website: "",
        timezone: "America/Los_Angeles",
        language: "English",
      },
      "settings-Branding": {
        image: "/logo.jpg",
        favicon: "",
        primaryColor: "#1479B8",
        secondaryColor: "#8BC34A",
        footer: "CHOKIE IT SOLUTIONS",
      },
      "settings-Notifications": {
        inquiries: true,
        consultations: true,
        training: true,
        support: true,
      },
      "settings-SEO": {
        seoTitle: "CHOKIE IT SOLUTIONS",
        seoDescription: "Innovative and reliable technology solutions.",
        image: "/logo.jpg",
      },
    },
    media: [
      {
        id: "media-logo",
        name: "CHOKIE official logo.jpg",
        url: "/logo.jpg",
        type: "image/jpeg",
        size: 0,
      },
      {
        id: "media-data",
        name: "Data center.jpg",
        url: "/data-center.jpg",
        type: "image/jpeg",
        size: 0,
      },
      {
        id: "media-architecture",
        name: "Architecture.jpg",
        url: "/architecture.jpg",
        type: "image/jpeg",
        size: 0,
      },
      {
        id: "media-workspace",
        name: "Workspace.jpg",
        url: "/workspace.jpg",
        type: "image/jpeg",
        size: 0,
      },
    ],
    activity: [
      {
        id: "activity-1",
        action: "Reviewed service content",
        resource: "Services",
        user: "Alex Morgan (demo)",
        date: updatedAt,
        result: "Completed",
      },
      {
        id: "activity-2",
        action: "Assigned example ticket",
        resource: "Support",
        user: "Sam Taylor (demo)",
        date: updatedAt,
        result: "Completed",
      },
      {
        id: "activity-3",
        action: "Prepared homepage draft",
        resource: "Homepage",
        user: "Jordan Lee (demo)",
        date: updatedAt,
        result: "Draft",
      },
      {
        id: "activity-4",
        action: "Reviewed partner verification",
        resource: "Partners",
        user: "Alex Morgan (demo)",
        date: updatedAt,
        result: "Pending",
      },
    ],
  };
}
