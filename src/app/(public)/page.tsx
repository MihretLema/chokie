import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Network,
  Workflow,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Reveal,
  SectionHeading,
  ServicesGrid,
  CTASection,
  TrainingCards,
  TechImage,
  Values,
} from "@/components/site";
import { partners } from "@/lib/content";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <Reveal className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> TECHNOLOGY WITH PURPOSE
          </span>
          <h1>
            Empowering your
            <br />
            business through
            <br />
            <span>innovative technology.</span>
          </h1>
          <p>
            CHOKIE IT SOLUTIONS delivers reliable technology consulting,
            cybersecurity, modern IT infrastructure, business automation, and
            enterprise solutions to help organizations grow with confidence.
          </p>
          <div className="actions">
            <Button asChild>
              <Link href="/services">
                Explore Our Services <ArrowUpRight size={18} />
              </Link>
            </Button>
            <Link className="secondary-link" href="/contact">
              Get a Consultation <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-trust">
            <span>
              <Check size={15} /> Reliable solutions
            </span>
            <span>
              <Check size={15} /> Customer-first thinking
            </span>
          </div>
        </Reveal>
        <Reveal className="hero-visual">
          <TechImage eager />
          <div className="image-label">
            <span className="status-dot" /> BUILT FOR A CONNECTED FUTURE
          </div>
          <div className="hero-float">
            <span className="icon-box">
              <ShieldCheck size={25} />
            </span>
            <div>
              <strong>
                Your ambition.
                <br />
                Our expertise.
              </strong>
              <span>Connected. Protected. Ready.</span>
            </div>
            <ArrowUpRight size={22} />
          </div>
          <div className="visual-corner">
            IT INFRASTRUCTURE / SECURITY / INNOVATION
          </div>
        </Reveal>
      </section>
      <div className="expertise-strip">
        <div className="container">
          <span>YOUR TECHNOLOGY, WORKING TOGETHER</span>
          <div>
            <ShieldCheck />
            Cybersecurity
          </div>
          <div>
            <Network />
            Enterprise infrastructure
          </div>
          <div>
            <Workflow />
            Business intelligence
          </div>
        </div>
      </div>
      <section className="section container about-intro">
        <div>
          <span className="eyebrow">A PARTNER FOR WHAT’S NEXT</span>
          <h2>
            Your trusted technology
            <br />
            solutions partner.
          </h2>
        </div>
        <div>
          <p>
            Good technology moves your business forward. We bring consulting,
            infrastructure, security, and business solutions together to help
            you build a stronger digital foundation.
          </p>
          <p>
            Our mission is to provide innovative and reliable technology
            solutions that meet the needs of our clients.
          </p>
          <Link className="text-link" href="/about">
            Learn more about us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-title-row">
            <SectionHeading
              eyebrow="OUR EXPERTISE"
              title="Comprehensive IT solutions.\nBuilt around your business."
              text="From strategy to everyday support, find the expertise to take your organization forward."
            />
            <Link className="text-link" href="/services">
              Explore all services <ArrowUpRight size={18} />
            </Link>
          </div>
          <ServicesGrid />
        </div>
      </section>
      <section className="section container values-section">
        <div>
          <SectionHeading
            eyebrow="THE CHOKIE APPROACH"
            title="Technology is our expertise.\nTrust is our foundation."
            text="We believe strong relationships and thoughtful delivery are as essential as the technology itself."
          />
          <Link className="text-link" href="/about">
            What drives us <ArrowUpRight size={18} />
          </Link>
        </div>
        <Values />
      </section>
      <section className="section navy">
        <div className="container">
          <SectionHeading
            eyebrow="SOLUTIONS THAT MOVE YOU FORWARD"
            title="Built for your world.\nReady for what comes next."
          />
          <div className="feature-row">
            <TechImage />
            <div>
              <span className="eyebrow">01 / PROTECT & CONNECT</span>
              <h2>
                A stronger foundation.
                <br />A more secure future.
              </h2>
              <p>
                Bring cybersecurity and enterprise networking together to
                protect critical systems and support your organization’s growing
                infrastructure needs.
              </p>
              <Link className="text-link" href="/services/cybersecurity">
                Explore cybersecurity <ArrowUpRight size={18} />
              </Link>
              <Link
                className="text-link"
                href="/services/data-center-networking"
              >
                Explore enterprise networking <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <div className="feature-row reverse">
            <TechImage kind="team" />
            <div>
              <span className="eyebrow">02 / SIMPLIFY & ENABLE</span>
              <h2>
                Less friction.
                <br />
                More possibility.
              </h2>
              <p>
                Connect your business processes with automation and
                intelligence, backed by IT infrastructure designed for efficient
                everyday operations.
              </p>
              <Link className="text-link" href="/services/business-automation">
                Explore business automation <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/services/technology-supply">
                Explore IT infrastructure <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section container partners-home">
        <SectionHeading
          eyebrow="A CONNECTED TECHNOLOGY ECOSYSTEM"
          title="Great solutions start with the right technology."
          text="Explore technology names referenced in our company profile."
        />
        <div className="partner-wordmarks">
          {partners.slice(0, 6).map(([n]) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <Link className="text-link" href="/partners">
          View our technology ecosystem <ArrowUpRight size={18} />
        </Link>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-title-row">
            <SectionHeading
              eyebrow="INVEST IN WHAT YOU KNOW"
              title="Build expertise.\nUnlock your next opportunity."
              text="Professional training in security, auditing, management, and project delivery."
            />
            <Link className="text-link" href="/training">
              View Training Programs <ArrowUpRight size={18} />
            </Link>
          </div>
          <TrainingCards />
        </div>
      </section>
      <CTASection />
    </>
  );
}
