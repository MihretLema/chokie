"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Network,
  Workflow,
  MonitorCog,
  BriefcaseBusiness,
  KeyRound,
  Package,
  Camera,
  Phone,
  Headset,
  Check,
  GraduationCap,
} from "lucide-react";
import {
  services,
  training,
  partners,
  imagery,
  values,
  type Service,
} from "@/lib/content";
import { Button } from "./ui/button";
export const icons = [
  BriefcaseBusiness,
  ShieldCheck,
  Network,
  Workflow,
  KeyRound,
  Package,
  Camera,
  Phone,
  Headset,
];
export function Logo() {
  return (
    <span className="logo">
      <Image
        src="/logo.jpg"
        alt="CHOKIE IT SOLUTIONS"
        width={1774}
        height={1754}
        priority
      />
    </span>
  );
}
const nav = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Services", "/services"],
  ["Solutions", "/solutions"],
  ["Training", "/training"],
  ["Partners", "/partners"],
  ["Contact", "/contact"],
];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={scrolled ? "header scrolled" : "header"}>
      <div className="container header-inner">
        <Link href="/" aria-label="CHOKIE home">
          <Logo />
        </Link>
        <nav
          aria-label="Main navigation"
          className={open ? "navigation is-open" : "navigation"}
          id="main-navigation"
        >
          {nav.map(([title, url]) =>
            title === "Services" ? (
              <div className="nav-service" key={url}>
                <Link
                  className={path.startsWith(url) ? "active" : ""}
                  href={url}
                >
                  Services
                </Link>
                <details key={path} onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.currentTarget.open = false;
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}>
                  <summary aria-label="Open services menu">
                    <ChevronDown size={14} />
                  </summary>
                  <div className="dropdown">
                    {services.map((s) => (
                      <Link href={"/services/" + s.slug} key={s.slug}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            ) : (
              <Link
                key={url}
                href={url}
                aria-current={path === url ? "page" : undefined}
                className={path === url ? "active" : ""}
              >
                {title}
              </Link>
            ),
          )}
        </nav>
        <Button asChild className="header-cta">
          <Link href="/contact">
            Get a Consultation <ArrowUpRight size={16} />
          </Link>
        </Button>
        <button
          id="menu-toggle"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link href="/" aria-label="CHOKIE home">
            <Logo />
          </Link>
          <p>
            Reliable technology. Lasting partnerships.
            <br />
            Solutions for the way you work.
          </p>
          <span className="footer-note">Social channels coming soon.</span>
        </div>
        <div>
          <h3>Explore</h3>
          {[
            ["About us", "/about"],
            ["Solutions", "/solutions"],
            ["Partners", "/partners"],
            ["Clients", "/clients"],
            ["Contact", "/contact"],
          ].map(([t, h]) => (
            <Link href={h} key={h}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h3>Our expertise</h3>
          {services.slice(0, 4).map((s) => (
            <Link key={s.slug} href={"/services/" + s.slug}>
              {s.title}
            </Link>
          ))}
          <Link href="/services">
            All services <ArrowUpRight size={13} />
          </Link>
        </div>
        <div>
          <h3>Stay connected</h3>
          <Link href="/training">Professional training</Link>
          <Link href="/support">Support inquiries</Link>
          <Link href="/contact">Talk to our team</Link>
          <p>
            Office, telephone, and email details
            <br />
            will be published after verification.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} CHOKIE IT SOLUTIONS. All rights reserved.
        </span>
        <span>Technology with purpose.</span>
      </div>
    </footer>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>
        {title.replaceAll(
          String.fromCharCode(92, 110),
          String.fromCharCode(10),
        )}
      </h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
        </Reveal>
      </div>
    </section>
  );
}
export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = icons[index % icons.length];
  return (
    <Link className="service-card" href={"/services/" + service.slug}>
      <div className="card-top">
        <span className="icon-box">
          <Icon size={23} strokeWidth={1.6} />
        </span>
        <span className="card-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.short}</p>
      <span className="text-link">
        Learn more <ArrowUpRight size={17} />
      </span>
    </Link>
  );
}
export function ServicesGrid() {
  return (
    <div className="grid three">
      {services.map((s, i) => (
        <ServiceCard key={s.slug} service={s} index={i} />
      ))}
    </div>
  );
}
export function CTASection() {
  return (
    <section className="container cta">
      <div>
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>
          Ready to transform your
          <br />
          business with technology?
        </h2>
        <p>
          Connect with CHOKIE IT SOLUTIONS to explore technology
          <br className="desktop-break" /> solutions tailored to your
          organization.
        </p>
      </div>
      <Button asChild>
        <Link href="/contact">
          Let’s Talk <ArrowUpRight size={19} />
        </Link>
      </Button>
    </section>
  );
}
export function TrainingCards() {
  return (
    <div className="grid four">
      {training.map((t, i) => (
        <article className="training-card" key={t.title}>
          <div className="card-top">
            <GraduationCap size={25} />
            <span>0{i + 1}</span>
          </div>
          <h3>{t.title}</h3>
          <h4>{t.name}</h4>
          <p>{t.description}</p>
          <Link
            className="text-link"
            href={"/training#" + t.title.toLowerCase()}
          >
            Learn more <ArrowUpRight size={17} />
          </Link>
        </article>
      ))}
    </div>
  );
}
export function PartnerDirectory() {
  const [category, setCategory] = useState("All");
  return (
    <>
      <div className="filters" aria-label="Filter partners">
        {[
          "All",
          "Software",
          "Security",
          "Networking",
          "Infrastructure",
          "Technology",
        ].map((c) => (
          <button
            key={c}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="partner-grid">
        {partners
          .filter((p) => category === "All" || p[1] === category)
          .map(([n, c]) => (
            <article key={n}>
              <span>{c}</span>
              <h3>{n}</h3>
            </article>
          ))}
      </div>
      <p className="fine-print">
        Names referenced in the company profile. Categories are editorial
        groupings. Logos and partnership tiers are not displayed; brand usage
        and current status require verification.
      </p>
    </>
  );
}
export function Values() {
  return (
    <div className="values">
      {values.map((v, i) => (
        <div key={v}>
          <span>0{i + 1}</span>
          <h3>{v}</h3>
          <Check size={18} />
        </div>
      ))}
    </div>
  );
}
export function TechImage({
  kind = "hero",
  className = "",
  eager = false,
}: {
  kind?: keyof typeof imagery;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={"tech-image " + className}>
      <Image
        src={imagery[kind]}
        loading={eager ? "eager" : "lazy"}
        alt={
          kind === "hero"
            ? "Illuminated racks in a modern data center"
            : kind === "network"
              ? "Modern office towers viewed from below"
              : "Contemporary professional workspace"
        }
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <MonitorCog size={38} />
      <h2>
        {title.replaceAll(
          String.fromCharCode(92, 110),
          String.fromCharCode(10),
        )}
      </h2>
      <p>{text}</p>
      <Button asChild variant="outline">
        <Link href="/contact">
          Discuss your requirements <ArrowRight size={17} />
        </Link>
      </Button>
    </div>
  );
}
