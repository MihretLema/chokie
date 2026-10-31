import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {requireStaffPage} from '@/server/auth/page-guard';
import {modulePermission} from '@/server/permissions/definitions';
import {ApiError} from '@/server/utils/errors';
import { adminLinks } from "@/lib/admin/navigation";
import { modules } from "@/lib/admin/config";
import { CollectionManager } from "@/features/admin/collection-manager";
import { DocumentManager } from "@/features/admin/document-manager";
import { SeoManager } from "@/features/admin/seo-manager";
import {
  SettingsManager,
  ProfileManager,
} from "@/features/admin/settings-manager";
import { MediaLibrary } from "@/features/admin/media-library";
import { Notifications, ActivityLogs } from "@/features/admin/notifications";
export function generateStaticParams() {
  return adminLinks.filter((l) => l.slug).map((l) => ({ module: l.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const title = adminLinks.find((l) => l.slug === module)?.title || "Not found";
  return { title, robots: { index: false, follow: false } };
}
export default async function AdminModule({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>;
  searchParams: Promise<{ record?: string }>;
}) {
  const { module } = await params;
  if(!modulePermission[module])notFound();
  try{await requireStaffPage(modulePermission[module])}catch(error){if(error instanceof ApiError&&error.status===403)return <section className="ad-panel ad-editor-panel"><h1>Access restricted</h1><p>Your role does not allow access to this module.</p></section>;throw error;}
  const { record } = await searchParams;
  if (modules[module])
    return (
      <CollectionManager
        key={module + (record || "")}
        module={module}
        initialRecord={record}
      />
    );
  if (module === "homepage" || module === "about")
    return <DocumentManager key={module} module={module} />;
  switch (module) {
    case "media":
      return <MediaLibrary />;
    case "seo":
      return <SeoManager />;
    case "settings":
      return <SettingsManager />;
    case "profile":
      return <ProfileManager />;
    case "notifications":
      return <Notifications />;
    case "activity":
      return <ActivityLogs />;
    default:
      notFound();
  }
}
