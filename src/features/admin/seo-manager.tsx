"use client";
import { useState } from "react";
import { SearchCheck } from "lucide-react";
import { useDemo } from "@/components/admin/demo-provider";
import { ContentEditor } from "@/components/admin/content-editor";
import { PageTitle } from "@/components/admin/primitives";
import { seoFields } from "@/lib/admin/config";
import type { EditorValues } from "@/lib/admin/types";
export function SeoManager() {
  const { data, saveDocument } = useDemo();
  const [page, setPage] = useState("home");
  const [preview, setPreview] = useState<EditorValues | null>(null);
  const selected = (data.collections.pages || []).find(
    (p) => p.values.slug === page,
  );
  const saved = data.documents["seo-" + page] || {
    seoTitle: String(selected?.values.seoTitle || "CHOKIE IT SOLUTIONS"),
    seoDescription: String(
      selected?.values.seoDescription ||
        "Innovative and reliable technology solutions.",
    ),
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    image: "/logo.jpg",
    index: true,
  };
  const shown = preview || saved;
  return (
    <>
      <PageTitle
        eyebrow="CONTENT & MEDIA"
        title="SEO management"
        description="Prepare clear, useful search and sharing metadata for every page."
      />
      <div className="ad-media-toolbar">
        <label className="ad-field">
          <span>Select page</span>
          <select
            className="ad-input"
            value={page}
            onChange={(e) => {
              setPage(e.target.value);
              setPreview(null);
            }}
          >
            {(data.collections.pages || []).map((p) => (
              <option key={p.id} value={String(p.values.slug)}>
                {String(p.values.title)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="ad-seo-layout">
        <section className="ad-panel ad-editor-panel">
          <ContentEditor
            key={page}
            fields={seoFields}
            initialValues={saved}
            onSave={(values) => {
              saveDocument("seo-" + page, values, "Saved SEO demo draft");
              setPreview(values);
            }}
            onValuesChange={setPreview}
            submitLabel="Save SEO draft"
          />
        </section>
        <aside>
          <div className="ad-search-preview">
            <span>SEARCH RESULT PREVIEW · LOCAL EDITOR</span>
            <small>
              {String(
                shown.canonical || "Your verified domain will appear here",
              )}
            </small>
            <h3>{String(shown.seoTitle)}</h3>
            <p>{String(shown.seoDescription)}</p>
          </div>
          <div className="ad-inline-note" style={{ marginTop: 18 }}>
            <SearchCheck size={17} />
            <span>
              This preview does not affect live metadata or search results.
              Changes require backend integration and publication.
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
