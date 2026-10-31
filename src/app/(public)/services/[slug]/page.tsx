import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/content";
import {
  PageHero,
  TechImage,
  CTASection,
  ServiceCard,
} from "@/components/site";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  return {
    title: s?.title,
    description: s?.short,
    openGraph: { title: s?.title, description: s?.short },
  };
}
export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  return (
    <>
      <PageHero
        eyebrow={s.title}
        title={s.short}
        text={
          "Purposeful " +
          s.title.toLowerCase() +
          " solutions from CHOKIE IT SOLUTIONS."
        }
      />
      <section className="section container feature-row">
        <div>
          <span className="eyebrow">EXPERTISE WITH PURPOSE</span>
          <h2>{s.title}</h2>
          <p>{s.benefit}</p>
          <h3 className="capability-title">Core capabilities</h3>
          <ul className="capabilities">
            {s.capabilities.map((c) => (
              <li key={c}>
                <Check size={19} />
                {c}
              </li>
            ))}
          </ul>
          <Link className="text-link" href={"/contact"}>
            Discuss your requirements <ArrowUpRight size={18} />
          </Link>
        </div>
        <TechImage kind={slug === "business-automation" ? "team" : "hero"} />
      </section>
      <section className="section soft">
        <div className="container benefit">
          <span className="eyebrow">WHAT THIS MEANS FOR YOUR BUSINESS</span>
          <h2>{s.benefit}</h2>
          <p>
            Start with a conversation about your current environment and
            priorities. Together, we can identify the right scope for your
            organization.
          </p>
        </div>
      </section>
      <section className="section container">
        <span className="eyebrow">CONNECTED EXPERTISE</span>
        <h2>Explore related services.</h2>
        <div className="grid three">
          {services
            .filter((r) => r.slug !== slug)
            .slice(0, 3)
            .map((r) => (
              <ServiceCard
                key={r.slug}
                service={r}
                index={services.indexOf(r)}
              />
            ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
