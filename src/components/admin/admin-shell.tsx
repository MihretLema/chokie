"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Logo } from "@/components/site";
import { navigation, adminLinks } from "@/lib/admin/navigation";
import { DemoProvider, useDemo } from "./demo-provider";
import { AdminDialog, ConfirmDialog, AdminLoading } from "./primitives";
import {signOut,SignOutButton} from '@/components/auth/sign-out';
function Navigation({
  close,
  compact = false,
}: {
  close: () => void;
  compact?: boolean;
}) {
  const path = usePathname();
  const { data,notify } = useDemo();
  return (
    <>
      <Link
        className="ad-brand"
        href="/admin"
        onClick={close}
        aria-label="CHOKIE admin overview"
      >
        <Logo />
      </Link>
      <div className="ad-workspace-label">
        WORKSPACE <span>DEMO</span>
      </div>
      <nav aria-label="Admin navigation" className="ad-nav">
        {navigation.map((group) => (
          <details open key={group.label} className="ad-nav-group">
            <summary title={group.label}>
              <span>{compact ? group.label.slice(0, 1) : group.label}</span>
              <Icons.ChevronDown size={12} />
            </summary>
            {group.items.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons] as LucideIcon;
              const href = "/admin" + (item.slug ? "/" + item.slug : "");
              return (
                <Link
                  title={item.title}
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                  className={path === href ? "active" : ""}
                  onClick={close}
                >
                  <Icon size={18} strokeWidth={1.7} />
                  {!compact && <span>{item.title}</span>}
                  {!compact && item.slug === "inquiries" && (
                    <span className="ad-nav-count">
                      {(data.collections.inquiries || []).length}
                    </span>
                  )}
                </Link>
              );
            })}
          </details>
        ))}
      </nav>
      <div className="ad-sidebar-user">
        <span className="ad-avatar">AM</span>
        {!compact && (
          <div>
            <strong>Administrator</strong>
            <span>Local development preview</span>
          </div>
        )}
        <button className="ad-icon-button" title="Sign out" aria-label="Sign out" onClick={()=>void signOut().catch(()=>notify('Sign out failed. Please try again.'))}>
          <Icons.LogOut size={17} />
        </button>
      </div>
    </>
  );
}
function Shell({ children,identity }: { children: React.ReactNode;identity:string }) {
  const path = usePathname();
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const { data, ready, error, retry, reset } = useDemo();
  const page = adminLinks.find(
    (l) => path === "/admin" + (l.slug ? "/" + l.slug : ""),
  );
  const unread = (data.collections.notifications || []).filter(
    (n) => !n.values.read,
  ).length;
  useEffect(() => setMobile(false), [path]);
  const hits = adminLinks.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase()),
  );
  const records =
    query.length > 1
      ? Object.entries(data.collections)
          .flatMap(([key, items]) =>
            items
              .filter((r) =>
                String(
                  r.values.title || r.values.name || r.values.subject || "",
                )
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((r) => ({
                key,
                id: r.id,
                title: String(
                  r.values.title || r.values.name || r.values.subject,
                ),
              })),
          )
          .slice(0, 8)
      : [];
  return (
    <div className={"admin-root" + (compact ? " ad-compact" : "")}>
      <a href="#admin-main" className="skip-link">
        Skip to admin content
      </a>
      <aside className="ad-sidebar">
        <Navigation compact={compact} close={() => {}} />
      </aside>
      <Dialog.Root open={mobile} onOpenChange={setMobile}>
        <Dialog.Portal>
          <Dialog.Overlay className="ad-overlay" />
          <Dialog.Content className="ad-mobile-sidebar">
            <Dialog.Title className="sr-only">Admin navigation</Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose a dashboard module.
            </Dialog.Description>
            <Dialog.Close
              className="ad-mobile-close ad-icon-button"
              aria-label="Close navigation"
            >
              <Icons.X size={18} />
            </Dialog.Close>
            <Navigation close={() => setMobile(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="ad-workspace">
        <header className="ad-topbar">
          <button
            className="ad-icon-button ad-desktop-toggle"
            onClick={() => setCompact(!compact)}
            aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icons.PanelLeft size={20} />
          </button>
          <button
            className="ad-icon-button ad-mobile-toggle"
            onClick={() => setMobile(true)}
            aria-label="Open admin navigation"
            aria-expanded={mobile}
          >
            <Icons.Menu size={21} />
          </button>
          <div className="ad-breadcrumbs">
            <Link href="/admin">Workspace</Link>
            <Icons.ChevronRight size={13} />
            <span>{page?.title || "Dashboard"}</span>
          </div>
          <button
            className="ad-global-search"
            aria-label="Search workspace"
            onClick={() => setSearchOpen(true)}
          >
            <Icons.Search size={16} />
            <span>Search workspace…</span>
            <kbd>Search</kbd>
          </button>
          <Link
            className="ad-notification-button ad-icon-button"
            href="/admin/notifications"
            aria-label={`Notifications, ${unread} unread`}
          >
            <Icons.Bell size={19} />
            {unread > 0 && <span />}
          </Link>
          <details className="ad-profile-menu">
            <summary aria-label="Open profile menu">
              <span className="ad-avatar small">AM</span>
              <Icons.ChevronDown size={12} />
            </summary>
            <div>
              <strong>{identity}</strong>
              <Link href="/admin/profile">Your profile</Link>
              <Link href="/admin/users">Users & roles</Link>
              <button onClick={() => setResetOpen(true)}>
                Reset demo data
              </button>
              <SignOutButton/>
            </div>
          </details>
        </header>
        <div className="ad-demo-banner">
          <span>
            <Icons.FlaskConical size={14} />
            <strong>Development preview</strong>
            <span className="ad-banner-detail">
              Phase 2 demo UI · Signed in securely · API integration in Phase 4
            </span>
          </span>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View website <Icons.ArrowUpRight size={14} />
          </Link>
        </div>
        <main id="admin-main" className="ad-main">
          {error ? (
            <div className="ad-error" role="alert">
              <h1>Workspace could not load</h1>
              <p>{error}</p>
              <button className="ad-btn" onClick={retry}>
                Retry
              </button>
            </div>
          ) : !ready ? (
            <AdminLoading />
          ) : (
            children
          )}
        </main>
        <div className="ad-bottom-note">
          <span>© {new Date().getFullYear()} CHOKIE IT SOLUTIONS</span>
          <span>Phase 2 · Demo workspace</span>
        </div>
      </div>
      <AdminDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search workspace"
        description="Find a module or a record in the local demonstration data."
      >
        <label className="ad-field">
          <span>Search modules and records</span>
          <input
            className="ad-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try services, support, or a name…"
          />
        </label>
        <div className="ad-search-results">
          {hits.map((h) => (
            <Link
              key={h.slug}
              href={"/admin" + (h.slug ? "/" + h.slug : "")}
              onClick={() => setSearchOpen(false)}
            >
              <Icons.LayoutGrid size={17} />
              <span>{h.title}</span>
              <Icons.ArrowUpRight size={15} />
            </Link>
          ))}
          {records.map((r) => (
            <Link
              key={r.id}
              href={"/admin/" + r.key + "?record=" + encodeURIComponent(r.id)}
              onClick={() => setSearchOpen(false)}
            >
              <Icons.FileText size={17} />
              <span>
                {r.title}
                <small>
                  {r.key} · {r.id}
                </small>
              </span>
              <Icons.ArrowUpRight size={15} />
            </Link>
          ))}
          {hits.length + records.length === 0 && (
            <p>No matching modules or records.</p>
          )}
        </div>
      </AdminDialog>
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => void reset()}
        title="Reset this demo workspace?"
        description="Your local edits and selected files will be removed from this tab. The original sample data will be restored."
        confirmLabel="Reset demo"
      />
    </div>
  );
}
export function AdminShell({ children,identity }: { children: React.ReactNode;identity:string }) {
  return (
    <DemoProvider>
      <Shell identity={identity}>{children}</Shell>
    </DemoProvider>
  );
}
