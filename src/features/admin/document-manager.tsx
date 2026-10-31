"use client";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Eye,
  Send,
  Info,
} from "lucide-react";
import { documentFields } from "@/lib/admin/config";
import { useDemo } from "@/components/admin/demo-provider";
import { ContentEditor, LocalPreview } from "@/components/admin/content-editor";
import {
  PageTitle,
  ConfirmDialog,
  StatusBadge,
} from "@/components/admin/primitives";
import type { EditorValues } from "@/lib/admin/types";
export function DocumentManager({ module }: { module: "homepage" | "about" }) {
  const { data, saveDocument, notify } = useDemo();
  const document = data.documents[module] || {};
  const [order, setOrder] = useState<string[]>(
    Array.isArray(document.sectionOrder) ? document.sectionOrder : [],
  );
  const [visible, setVisible] = useState<EditorValues>(
    Object.fromEntries(
      order.map((s) => ["show" + s, document["show" + s] !== false]),
    ),
  );
  const [drag, setDrag] = useState<number | null>(null);
  const [publish, setPublish] = useState(false);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState(String(document.status || "Draft"));
  const [previewValues, setPreviewValues] = useState(document);
  const [dirty, setDirty] = useState(false);
  function move(from: number, to: number) {
    if (to < 0 || to >= order.length) return;
    const copy = [...order];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    setOrder(copy);
    setDirty(true);
  }
  function save(values: EditorValues) {
    const next = {
      ...document,
      ...values,
      sectionOrder: order,
      ...visible,
      status: "Draft",
    };
    setPreviewValues(next);
    saveDocument(module, next, "Saved " + module + " demo draft");
    setStatus("Draft");
    setDirty(false);
  }
  return (
    <>
      <PageTitle
        eyebrow="WEBSITE MANAGEMENT"
        title={module === "homepage" ? "Homepage content" : "About Us content"}
        description="Make your story clear and compelling. Edit a local draft without changing the public website."
        actions={
          <button
            className="ad-btn secondary"
            onClick={() => {
              setPreviewValues(data.documents[module] || {});
              setPreview(true);
            }}
          >
            <Eye size={15} />
            Preview saved draft
          </button>
        }
      />
      <div className="ad-content-layout">
        <div className="ad-panel ad-editor-panel">
          <div className="ad-inline-note">
            <Info size={16} />
            <span>
              Save Draft stores your fields, visibility, and section order in
              this browser tab. Preview opens your current form values.
            </span>
          </div>
          <ContentEditor
            fields={documentFields[module]}
            initialValues={document}
            onSave={save}
            submitLabel="Save Draft"
            previewExtra={{ sectionOrder: order, ...visible }}
          />
        </div>
        <aside className="ad-panel ad-side-panel">
          <h2>
            {module === "homepage" ? "Homepage sections" : "Publication state"}
          </h2>
          <p>
            {module === "homepage"
              ? "Drag sections or use the arrow buttons to change their order. Toggle a section’s demo visibility."
              : "Review your draft before marking it published in the demo."}
          </p>
          {module === "homepage" && (
            <ol className="ad-section-order">
              {order.map((section, i) => (
                <li
                  key={section}
                  draggable
                  onDragStart={() => setDrag(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (drag !== null) move(drag, i);
                    setDrag(null);
                  }}
                >
                  <GripVertical size={13} />
                  <span>{section}</span>
                  <button
                    className="ad-switch"
                    role="switch"
                    aria-label={"Show " + section}
                    aria-checked={!!visible["show" + section]}
                    onClick={() => {
                      setVisible({
                        ...visible,
                        ["show" + section]: !visible["show" + section],
                      });
                      setDirty(true);
                    }}
                  >
                    <span />
                  </button>
                  <button
                    className="ad-icon-button"
                    aria-label={"Move " + section + " up"}
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    className="ad-icon-button"
                    aria-label={"Move " + section + " down"}
                    disabled={i === order.length - 1}
                    onClick={() => move(i, i + 1)}
                  >
                    <ArrowDown size={12} />
                  </button>
                </li>
              ))}
            </ol>
          )}
          {dirty && (
            <p className="ad-order-dirty">
              Section changes are unsaved. Use Save Draft.
            </p>
          )}
          <div className="ad-publish-box">
            <StatusBadge value={status} />
            <p>
              Publication is a local demo status only. It does not update the
              live website.
            </p>
            <button
              className="ad-btn"
              onClick={() => {
                if (dirty) {
                  notify("Save the draft before marking it published.");
                  return;
                }
                setPublish(true);
              }}
            >
              <Send size={14} />
              Publish demo draft
            </button>
          </div>
        </aside>
      </div>
      <ConfirmDialog
        open={publish}
        onClose={() => setPublish(false)}
        onConfirm={() => {
          saveDocument(
            module,
            { ...data.documents[module], status: "Published" },
            "Marked draft published in demo",
          );
          setStatus("Published");
        }}
        title="Mark this demo draft published?"
        description="Only the saved local draft will be marked published. Unsaved form edits and the public website are not changed."
        confirmLabel="Mark published in demo"
      />
      <LocalPreview
        open={preview}
        onClose={() => setPreview(false)}
        title="Saved draft preview"
        fields={documentFields[module]}
        values={previewValues}
      />
    </>
  );
}
