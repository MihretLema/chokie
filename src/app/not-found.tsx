import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section container empty-state">
      <span className="eyebrow">404</span>
      <h1>This page couldn’t be found.</h1>
      <p>Explore our services or return to the homepage.</p>
      <Link href="/" className="button button-primary">
        Back to home
      </Link>
    </section>
  );
}
