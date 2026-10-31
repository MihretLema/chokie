"use client";
import { useState } from "react";
import {
  Upload,
  Search,
  Grid2X2,
  List,
  Copy,
  Pencil,
  Trash2,
  ImageIcon,
} from "lucide-react";
import type { MediaAsset } from "@/lib/admin/types";
import { useDemo } from "@/components/admin/demo-provider";
import {
  PageTitle,
  AdminDialog,
  ConfirmDialog,
  AdminEmpty,
} from "@/components/admin/primitives";
import { ContentEditor } from "@/components/admin/content-editor";
export function MediaLibrary() {
  const { data, setMedia, notify } = useDemo();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All images");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [rename, setRename] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState<MediaAsset | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  async function selectFiles(files: FileList | File[]) {
    setUploadError("");
    const chosen = Array.from(files);
    if (!chosen.length) return;
    const invalid = chosen.find(
      (f) =>
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          f.type,
        ) || f.size > 2 * 1024 * 1024,
    );
    if (invalid) {
      setUploadError(
        "Choose JPEG, PNG, WebP, or GIF images up to 2 MB each. Unsupported file: " +
          invalid.name,
      );
      return;
    }
    if (chosen.reduce((sum, f) => sum + f.size, 0) > 4 * 1024 * 1024) {
      setUploadError("Select no more than 4 MB of images at a time.");
      return;
    }
    setBusy(true);
    try {
      const assets = await Promise.all(
        chosen.map(
          (file) =>
            new Promise<MediaAsset>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  id: crypto.randomUUID(),
                  name: file.name,
                  url: String(reader.result),
                  type: file.type,
                  size: file.size,
                  local: true,
                });
              reader.onerror = () => reject(new Error("Read failed"));
              reader.readAsDataURL(file);
            }),
        ),
      );
      setMedia([...data.media, ...assets]);
    } catch {
      setUploadError("A file could not be read. Try selecting it again.");
    } finally {
      setBusy(false);
    }
  }
  async function copy(asset: MediaAsset) {
    try {
      await navigator.clipboard.writeText(
        asset.local ? asset.url : new URL(asset.url, location.origin).href,
      );
      notify(
        "Copied " +
          (asset.local
            ? "local preview data URL. This is not a hosted file."
            : "local development asset URL."),
      );
    } catch {
      notify(
        "Clipboard access is unavailable. Open the file details to inspect its source.",
      );
    }
  }
  const assets = data.media.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) &&
      (type === "All images" || a.type === "image/" + type.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="CONTENT & MEDIA"
        title="Media library"
        description="Your visual assets, all in one place. Local file selections are previews, not permanent uploads."
      />
      <label
        className="ad-upload"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void selectFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={25} />
        <strong>
          {busy ? "Reading local files…" : "Drop images here, or browse files"}
        </strong>
        <span>JPEG, PNG, WebP, GIF · Up to 2 MB each · Browser tab only</span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            if (e.target.files) void selectFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {uploadError && (
        <p className="ad-field-error" role="alert">
          {uploadError}
        </p>
      )}
      <div className="ad-media-toolbar">
        <label className="ad-table-search">
          <Search size={16} />
          <input
            aria-label="Search media"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your media…"
          />
        </label>
        <div>
          <select
            className="ad-input"
            aria-label="Filter file type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {["All images", "JPEG", "PNG", "WebP", "GIF"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            className={"ad-icon-button " + (view === "grid" ? "active" : "")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={18} />
          </button>
          <button
            className="ad-icon-button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List size={19} />
          </button>
        </div>
      </div>
      <div className={"ad-media-grid " + (view === "list" ? "list" : "")}>
        {assets.map((asset) => (
          <article
            className={"ad-media-card " + (view === "list" ? "list" : "")}
            key={asset.id}
          >
            <button
              onClick={() => setSelected(asset)}
              aria-label={"Preview " + asset.name}
            >
              <img src={asset.url} alt={asset.name} />
            </button>
            <div>
              <h3>{asset.name}</h3>
              <p>
                {asset.type.replace("image/", "").toUpperCase()} ·{" "}
                {asset.local
                  ? Math.ceil(asset.size / 1024) + " KB · Local preview"
                  : "Bundled asset"}
              </p>
            </div>
            <div className="ad-media-actions">
              <button
                className="ad-icon-button"
                aria-label={"Copy URL for " + asset.name}
                onClick={() => void copy(asset)}
              >
                <Copy size={14} />
              </button>
              <button
                className="ad-icon-button"
                aria-label={"Rename " + asset.name}
                onClick={() => setRename(asset)}
              >
                <Pencil size={14} />
              </button>
              <button
                className="ad-icon-button"
                aria-label={"Remove " + asset.name}
                onClick={() => setDeleting(asset)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!assets.length && (
        <AdminEmpty
          title="No matching media"
          text="Try another search, or select an image from your computer."
        />
      )}
      <AdminDialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.name || "File details"}
        description="Image preview and local file information."
        wide
      >
        {selected && (
          <>
            <img
              className="ad-media-detail-image"
              src={selected.url}
              alt={selected.name}
            />
            <div className="ad-detail-grid">
              <div>
                <h3>File type</h3>
                <p>{selected.type}</p>
              </div>
              <div>
                <h3>Storage</h3>
                <p>
                  {selected.local
                    ? "Local browser preview. Not uploaded."
                    : "Bundled public asset."}
                </p>
              </div>
              <div>
                <h3>File size</h3>
                <p>
                  {selected.size
                    ? Math.ceil(selected.size / 1024) + " KB"
                    : "Not provided"}
                </p>
              </div>
              <div>
                <h3>Source</h3>
                <p>
                  {selected.local ? "Local preview data URL" : selected.url}
                </p>
              </div>
            </div>
            <button
              className="ad-btn secondary"
              onClick={() => void copy(selected)}
              style={{ marginTop: 20 }}
            >
              <Copy size={14} />
              Copy file URL
            </button>
          </>
        )}
      </AdminDialog>
      <AdminDialog
        open={!!rename}
        onOpenChange={(open) => {
          if (!open) setRename(null);
        }}
        title="Rename local media"
        description="This changes the display name in the demo library only."
      >
        {rename && (
          <ContentEditor
            fields={[
              {
                key: "name",
                label: "File display name",
                required: true,
                max: 120,
              },
            ]}
            initialValues={{ name: rename.name }}
            showPreview={false}
            onSave={(values) => {
              setMedia(
                data.media.map((a) =>
                  a.id === rename.id ? { ...a, name: String(values.name) } : a,
                ),
              );
              setRename(null);
            }}
          />
        )}
      </AdminDialog>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting)
            setMedia(data.media.filter((a) => a.id !== deleting.id));
        }}
        title="Remove this library item?"
        description="The item will be removed from the local demo library. No original file is deleted from your computer or from the public website."
      />
    </>
  );
}
