"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="ad-error" role="alert">
      <h1>This module couldn’t load.</h1>
      <p>Your public website is unaffected. Retry the module to continue.</p>
      <button className="ad-btn" onClick={reset}>
        Retry module
      </button>
    </div>
  );
}
