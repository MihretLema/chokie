import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin, Mail, Clock, GraduationCap } from "lucide-react";
import {
  PageHero,
  CTASection,
  ServicesGrid,
  TechImage,
  Values,
  PartnerDirectory,
  EmptyState,
} from "@/components/site";
import { InquiryForm } from "@/components/inquiry-form";
import { services, solutions, training } from "@/lib/content";
const pages: Record<string, { title: string; heading: string; text: string }> =
  {
    about: {
      title: "About Us",
      heading: "Thoughtful technology.\nLasting partnerships.",
      text: "We bring reliable technology and a customer-focused approach to your organization’s next chapter.",
    },
    services: {
      title: "Our Services",
      heading: "The expertise you need.\nAll working together.",
      text: "Nine connected areas of expertise, from your first technology roadmap to ongoing operational support.",
    },
    solutions: {
      title: "Business Solutions",
      heading: "Your challenges.\nOur shared starting point.",
      text: "Explore technology solutions organized around the way your business works.",
    },
    training: {
      title: "Professional Training",
      heading: "Invest in knowledge.\nBuild what comes next.",
      text: "Explore professional training in information security, project management, auditing, and governance.",
    },
    partners: {
      title: "Technology Partners",
      heading: "A world of technology.\nA connected approach.",
      text: "Explore the technology ecosystem referenced in the CHOKIE IT SOLUTIONS company profile.",
    },
    clients: {
      title: "Our Clients",
      heading: "Relationships built\non trust.",
      text: "Our approach begins with understanding the organization, its people, and its technology needs.",
    },
    contact: {
      title: "Contact",
      heading: "Let’s move your\nbusiness forward.",
      text: "Tell us what you’re working toward. Start a conversation about technology that fits your organization.",
    },
    support: {
      title: "Support",
      heading: "Here for your\ntechnology needs.",
      text: "Describe your technical issue using the support inquiry preview below.",
    },
  };
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const p = pages[page];
  return {
    title: p?.title ?? "Page not found",
    description: p?.text,
    openGraph: { title: p?.title, description: p?.text },
  };
}
export default async function ContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const p = pages[page];
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={p.title} title={p.heading} text={p.text} />
      {page === "about" && (
        <>
          <section className="section container feature-row">
            <TechImage kind="team" />
            <div>
              <span className="eyebrow">WHO WE ARE</span>
              <h2>Your trusted technology solutions partner.</h2>
              <p>
                CHOKIE IT SOLUTIONS provides information technology enabled
                services across consulting, cybersecurity, modern data centers
                and networking, business automation and intelligence, software
                licensing, technology supply, surveillance, enterprise
                communications, and maintenance and support.
              </p>
              <p>
                We work toward customer satisfaction and long-term
                relationships, guided by trust, quality, and integrity.
              </p>
            </div>
          </section>
          <section className="section soft">
            <div className="container grid two">
              <article className="statement">
                <span className="eyebrow">OUR VISION</span>
                <h2>
                  To be a trusted and successful global technology company.
                </h2>
              </article>
              <article className="statement">
                <span className="eyebrow">OUR MISSION</span>
                <h2>
                  To provide innovative and reliable technology solutions to
                  meet the needs of our clients.
                </h2>
              </article>
            </div>
          </section>
          <section className="section container values-section">
            <div>
              <span className="eyebrow">OUR VALUES</span>
              <h2>
                Principles that guide
                <br />
                every partnership.
              </h2>
              <p>
                Customer satisfaction and long-term relationships are at the
                heart of our value system.
              </p>
            </div>
            <Values />
          </section>
        </>
      )}
      {page === "services" && (
        <section className="section container">
          <ServicesGrid />
        </section>
      )}
      {page === "solutions" && (
        <section className="section container solution-list">
          {solutions.map((s, i) => (
            <Link
              className="solution-row"
              href={"/services/" + s.slug}
              key={s.slug}
            >
              <span className="solution-number">0{i + 1}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
              <ArrowUpRight />
              <span className="sr-only">Explore {s.title}</span>
            </Link>
          ))}
          <TechImage kind="network" />
        </section>
      )}
      {page === "training" && (
        <>
          <section className="section container">
            <div className="grid two">
              {training.map((t) => (
                <article
                  id={t.title.toLowerCase()}
                  className="training-detail"
                  key={t.title}
                >
                  <GraduationCap size={30} />
                  <span className="eyebrow">PROFESSIONAL DEVELOPMENT</span>
                  <h2>{t.title}</h2>
                  <h3>{t.name}</h3>
                  <p>{t.description}</p>
                  <p>
                    Contact the team to discuss availability, delivery format,
                    prerequisites, and program details.
                  </p>
                  <Link className="text-link" href="#training-inquiry">
                    Inquire about {t.title} <ArrowUpRight size={17} />
                  </Link>
                </article>
              ))}
            </div>
            <p className="fine-print">
              Program descriptions are introductory. Training schedules, fees,
              accreditation, and certification outcomes are not yet published.
            </p>
          </section>
          <section className="section soft" id="training-inquiry">
            <div className="container contact-layout">
              <div>
                <span className="eyebrow">KEEP LEARNING</span>
                <h2>
                  Find your next
                  <br />
                  learning opportunity.
                </h2>
                <p>Explore a program that fits your professional goals.</p>
              </div>
              <InquiryForm mode="training" />
            </div>
          </section>
        </>
      )}
      {page === "partners" && (
        <section className="section container">
          <PartnerDirectory />
        </section>
      )}
      {page === "clients" && (
        <section className="section container">
          <EmptyState
            title="Client stories, with permission."
            text="Approved client showcases and case studies will appear here. We respect our clients’ privacy and publish references only after approval."
          />
        </section>
      )}
      {(page === "contact" || page === "support") && (
        <section className="section container contact-layout">
          <aside>
            <span className="eyebrow">
              {page === "contact"
                ? "START A CONVERSATION"
                : "TECHNICAL ASSISTANCE"}
            </span>
            <h2>
              {page === "contact"
                ? "Good technology starts\nwith understanding."
                : "Tell us what\nyou’re experiencing."}
            </h2>
            <p>
              {page === "contact"
                ? "Share your priorities, challenges, or ideas using the form preview."
                : "Add the affected service, symptoms, and priority. Do not include passwords or sensitive system credentials."}
            </p>
            <div className="contact-info">
              <MapPin />
              <div>
                <h3>Our office</h3>
                <p>Office location pending verification.</p>
              </div>
            </div>
            <div className="contact-info">
              <Mail />
              <div>
                <h3>Contact details</h3>
                <p>
                  Official email and phone will be published after verification.
                </p>
              </div>
            </div>
            <div className="contact-info">
              <Clock />
              <div>
                <h3>Maintenance & support</h3>
                <p>
                  Our profile includes 24/7 support services. This preview is
                  not a live support channel.
                </p>
              </div>
            </div>
            <div className="map-placeholder">
              <MapPin size={30} />
              <span>Office map coming soon</span>
              <small>Location will be added once verified.</small>
            </div>
          </aside>
          <InquiryForm mode={page === "support" ? "support" : "contact"} />
        </section>
      )}
      <CTASection />
    </>
  );
}
