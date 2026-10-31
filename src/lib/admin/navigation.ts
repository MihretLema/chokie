export const navigation = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", slug: "", icon: "LayoutDashboard" }],
  },
  {
    label: "Website management",
    items: [
      { title: "Homepage", slug: "homepage", icon: "House" },
      { title: "About Us", slug: "about", icon: "Building2" },
      { title: "Services", slug: "services", icon: "Layers3" },
      { title: "Solutions", slug: "solutions", icon: "Workflow" },
      { title: "Training", slug: "training", icon: "GraduationCap" },
      { title: "Partners", slug: "partners", icon: "Handshake" },
      { title: "Clients", slug: "clients", icon: "Building" },
      { title: "Testimonials", slug: "testimonials", icon: "Quote" },
      { title: "Pages", slug: "pages", icon: "Files" },
    ],
  },
  {
    label: "Customer management",
    items: [
      { title: "Contact Inquiries", slug: "inquiries", icon: "Inbox" },
      {
        title: "Consultation Requests",
        slug: "consultations",
        icon: "CalendarDays",
      },
      {
        title: "Training Registrations",
        slug: "registrations",
        icon: "ContactRound",
      },
      { title: "Support Tickets", slug: "support", icon: "Headset" },
    ],
  },
  {
    label: "Content & media",
    items: [
      { title: "Media Library", slug: "media", icon: "Images" },
      { title: "SEO Management", slug: "seo", icon: "SearchCheck" },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Users and Roles", slug: "users", icon: "UsersRound" },
      { title: "Notifications", slug: "notifications", icon: "Bell" },
      { title: "Activity Logs", slug: "activity", icon: "History" },
      { title: "Website Settings", slug: "settings", icon: "Settings2" },
      { title: "Profile", slug: "profile", icon: "CircleUserRound" },
    ],
  },
];
export const adminLinks = navigation.flatMap((g) => g.items);
