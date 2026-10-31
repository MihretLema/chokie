export interface Service {
  slug: string;
  title: string;
  short: string;
  capabilities: string[];
  benefit: string;
}
export const services: Service[] = [
  {
    slug: "it-consulting",
    title: "IT Consulting",
    short: "A clear technology roadmap, built around your business.",
    capabilities: [
      "IT environment assessment",
      "Technology roadmap development",
      "Computing environment optimization",
    ],
    benefit: "Align technology decisions with the way your organization works.",
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    short: "Protect your systems, connected devices, and what matters most.",
    capabilities: [
      "Security consulting and implementation",
      "Managed security services",
      "Industrial systems and connected-device protection",
    ],
    benefit:
      "Support business growth with integrated protection for your digital environment.",
  },
  {
    slug: "data-center-networking",
    title: "Modern Data Center & Networking",
    short: "Secure, scalable infrastructure for a connected organization.",
    capabilities: [
      "Modern data center solutions",
      "Enterprise networking",
      "Data processing and storage infrastructure",
    ],
    benefit:
      "Build a secure and efficient foundation that can grow with demand.",
  },
  {
    slug: "business-automation",
    title: "Business Automation & Intelligence",
    short: "Connect your workflows. Turn information into better decisions.",
    capabilities: [
      "Technology-driven business workflows",
      "Business intelligence solutions",
      "Operational efficiency",
    ],
    benefit: "Improve efficiency and enable informed decision-making.",
  },
  {
    slug: "software-licensing",
    title: "Software Licensing",
    short: "Bring clarity and control to your software environment.",
    capabilities: [
      "License activation",
      "Usage tracking and license compliance",
      "Software updates and upgrades",
    ],
    benefit:
      "Keep software use organized and aligned with licensing requirements.",
  },
  {
    slug: "technology-supply",
    title: "Technology Supply",
    short: "The right tools and equipment for everyday operations.",
    capabilities: [
      "Hardware components",
      "Software applications",
      "Networking equipment and technology tools",
    ],
    benefit:
      "Equip your team with technology selected for its operational needs.",
  },
  {
    slug: "surveillance",
    title: "Surveillance Solutions",
    short: "Thoughtful visibility and access control for your premises.",
    capabilities: [
      "CCTV camera installation",
      "Video surveillance systems",
      "Access control systems",
    ],
    benefit:
      "Strengthen visibility and physical security for business operations.",
  },
  {
    slug: "voip-pbx-sip",
    title: "VoIP / PBX / SIP Solutions",
    short: "Keep your people connected, wherever work happens.",
    capabilities: [
      "Business VoIP setup",
      "PBX systems",
      "SIP communications solutions",
    ],
    benefit:
      "Help employees communicate efficiently and stay productive on the go.",
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & 24/7 Support",
    short: "Keep critical technology running with ongoing expert support.",
    capabilities: [
      "Infrastructure monitoring and management",
      "Backup and business continuity",
      "Help desk, remote and onsite support",
    ],
    benefit:
      "Support system availability with ongoing maintenance and issue resolution.",
  },
];
export const values = [
  "Trust",
  "On-time Delivery",
  "Quality",
  "Innovation",
  "Integrity",
  "Customer Focus",
  "Teamwork",
];
export const training = [
  {
    title: "CISSP",
    name: "Information Systems Security",
    description:
      "Explore professional knowledge across information security and security management.",
  },
  {
    title: "PMP",
    name: "Project Management",
    description:
      "Develop your understanding of project leadership, planning, and delivery.",
  },
  {
    title: "CISA",
    name: "Information Systems Auditing",
    description:
      "Explore the principles of information systems auditing, control, and assurance.",
  },
  {
    title: "CISM",
    name: "Information Security Management",
    description:
      "Strengthen your understanding of security governance and risk management.",
  },
];
export const partners = [
  ["Microsoft", "Software"],
  ["Kaspersky", "Security"],
  ["Cisco", "Networking"],
  ["Dell EMC", "Infrastructure"],
  ["HP", "Infrastructure"],
  ["Huawei", "Networking"],
  ["Lenovo", "Infrastructure"],
  ["LG", "Technology"],
  ["Epson", "Technology"],
  ["Ruckus", "Networking"],
  ["TP-Link", "Networking"],
  ["IBM", "Software"],
  ["Oracle", "Software"],
  ["VMware", "Software"],
  ["Infosys", "Software"],
  ["SAP", "Software"],
  ["Fortinet", "Security"],
  ["Aruba", "Networking"],
  ["NVIDIA", "Infrastructure"],
  ["Netgear", "Networking"],
  ["Extreme Networks", "Networking"],
  ["ZTE", "Networking"],
  ["Canon", "Technology"],
  ["MSI", "Infrastructure"],
  ["Panasonic", "Technology"],
  ["Sony", "Technology"],
  ["Samsung", "Technology"],
  ["Asus", "Infrastructure"],
  ["Check Point", "Security"],
  ["Hikvision", "Security"],
  ["Axis", "Security"],
];
export const solutions = [
  {
    title: "Cybersecurity and Protection",
    slug: "cybersecurity",
    text: "Protect your digital environment with integrated security consulting and services.",
  },
  {
    title: "IT Infrastructure and Networking",
    slug: "data-center-networking",
    text: "Create a secure, scalable foundation for your business.",
  },
  {
    title: "Business Productivity and Automation",
    slug: "business-automation",
    text: "Make everyday work more efficient and information more useful.",
  },
  {
    title: "Enterprise Communications",
    slug: "voip-pbx-sip",
    text: "Connect teams with business voice and communications systems.",
  },
  {
    title: "Surveillance and Access Control",
    slug: "surveillance",
    text: "Bring visibility and controlled access to your premises.",
  },
  {
    title: "IT Maintenance and Support",
    slug: "maintenance-support",
    text: "Support continuity with monitoring, maintenance, and technical assistance.",
  },
];
export const imagery = {
  hero: "/data-center.jpg",
  network: "/architecture.jpg",
  team: "/workspace.jpg",
};
