"use client";
export function AdminTabs({
  tabs,
  value,
  onChange,
  label,
  panelId,
}: {
  tabs: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  panelId?: string;
}) {
  return (
    <div className="ad-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => (
        <button
          key={tab}
          role="tab"
          id={"tab-" + tab.replaceAll(" ", "-")}
          aria-selected={tab === value}
          aria-controls={panelId}
          tabIndex={tab === value ? 0 : -1}
          onClick={() => onChange(tab)}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (index + 1) % tabs.length
                : event.key === "ArrowLeft"
                  ? (index - 1 + tabs.length) % tabs.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tabs.length - 1
                      : -1;
            if (next >= 0) {
              event.preventDefault();
              onChange(tabs[next]);
              const buttons =
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                  '[role="tab"]',
                );
              buttons?.[next]?.focus();
            }
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
