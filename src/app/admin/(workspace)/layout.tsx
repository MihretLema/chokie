import type { Metadata } from "next";
import {requireStaffPage} from '@/server/auth/page-guard';
import { AdminShell } from "@/components/admin/admin-shell";
import {Logo} from '@/components/site';
import {SignOutButton} from '@/components/auth/sign-out';
export const metadata: Metadata = {
  title: {
    default: "Admin development preview | CHOKIE",
    template: "%s | CHOKIE Admin Preview",
  },
  robots: { index: false, follow: false },
  description:
    "Authenticated administrator workspace. Dashboard data integration follows in Phase 4.",
};
export const dynamic='force-dynamic';
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor=await requireStaffPage();
  if(process.env.NODE_ENV!=='development')return <div className="admin-root ad-auth-page"><section className="ad-auth-card"><Logo/><h1>Backend ready</h1><p>You are signed in securely. The dashboard’s live data integration is scheduled for Phase 4; demonstration records are not rendered in production.</p><a className="ad-btn" href="/api/admin/dashboard">View authorized backend metrics</a><SignOutButton/></section></div>;
  return <AdminShell identity={actor.email}>{children}</AdminShell>;
}
