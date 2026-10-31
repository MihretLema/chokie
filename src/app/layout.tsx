import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "CHOKIE IT SOLUTIONS | Technology with purpose",
    template: "%s | CHOKIE IT SOLUTIONS",
  },
  description:
    "Technology consulting, cybersecurity, enterprise infrastructure, business automation, and professional training.",
  openGraph: {
    title: "CHOKIE IT SOLUTIONS",
    description: "Reliable technology solutions for your organization.",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1774,
        height: 1754,
        alt: "CHOKIE IT SOLUTIONS",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
