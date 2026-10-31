export default function LoadingSkeleton() {
  return (
    <div className="container section" role="status" aria-label="Loading page">
      <div className="skeleton" />
      <div className="skeleton short" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
