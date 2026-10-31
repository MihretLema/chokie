"use client";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Save, Eye } from "lucide-react";
import { editorSchema } from "@/lib/admin/validation";
import type { EditorValues, FieldConfig } from "@/lib/admin/types";
import { MediaPicker } from "./media-picker";
import { AdminDialog, StatusBadge } from "./primitives";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export function LocalPreview({
  title,
  values,
  fields,
  open,
  onClose,
}: {
  title: string;
  values: EditorValues;
  fields: FieldConfig[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AdminDialog
      open={open}
      onOpenChange={onClose}
      title={title}
      description="Local content preview. This does not change the public website."
      wide
    >
      <div className="ad-content-preview">
        {values.image && (
          <img src={String(values.image)} alt="Content preview" />
        )}
        <span className="ad-eyebrow">DEMO PREVIEW</span>
        <h2>
          {String(values.headline || values.title || values.name || title)}
        </h2>
        {fields
          .filter(
            (f) => !["title", "headline", "name", "image"].includes(f.key),
          )
          .map((f) => (
            <div className="ad-preview-field" key={f.key}>
              <h3>{f.label}</h3>
              {f.type === "toggle" ? (
                <StatusBadge value={values[f.key]} />
              ) : Array.isArray(values[f.key]) ? (
                <ul>
                  {(values[f.key] as string[]).map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              ) : (
                <p>{String(values[f.key] ?? "") || "Not provided"}</p>
              )}
            </div>
          ))}
        {Array.isArray(values.sectionOrder) && (
          <div className="ad-preview-field">
            <h3>Section order & visibility</h3>
            <ol>
              {values.sectionOrder.map((section) => (
                <li key={section}>
                  {section} —{" "}
                  {values["show" + section] === false ? "Hidden" : "Visible"}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </AdminDialog>
  );
}
export function ContentEditor({
  fields,
  initialValues,
  onSave,
  module,
  submitLabel = "Save demo changes",
  extra,
  showPreview = true,
  onValuesChange,
  previewExtra,
}: {
  fields: FieldConfig[];
  initialValues: EditorValues;
  onSave: (values: EditorValues) => void;
  module?: string;
  submitLabel?: string;
  extra?: React.ReactNode;
  showPreview?: boolean;
  onValuesChange?: (values: EditorValues) => void;
  previewExtra?: EditorValues;
}) {
  const [preview, setPreview] = useState(false);
  const defaults: EditorValues = {
    ...Object.fromEntries(
      fields.map((f) => [
        f.key,
        f.type === "toggle"
          ? false
          : f.type === "list" || f.type === "multi"
            ? []
            : f.type === "select"
              ? f.options?.[0] || ""
              : "",
      ]),
    ),
    ...initialValues,
  };
  for (const field of fields) {
    if (field.type === "color")
      defaults[field.key] = String(
        defaults[field.key] || "#1479b8",
      ).toLowerCase();
  }
  const form = useForm<EditorValues>({
    resolver: zodResolver(editorSchema(fields, module)),
    defaultValues: defaults,
  });
  const values = form.watch();
  const onChangeRef = useRef(onValuesChange);
  onChangeRef.current = onValuesChange;
  useEffect(() => {
    const subscription = form.watch((next) =>
      onChangeRef.current?.(next as EditorValues),
    );
    return () => subscription.unsubscribe();
  }, [form]);
  return (
    <>
      <form
        className="ad-editor"
        noValidate
        onSubmit={form.handleSubmit(onSave)}
      >
        <div className="ad-editor-fields">
          {fields.map((field) => (
            <div
              className={
                "ad-field-wrap" +
                (["textarea", "list", "multi", "image"].includes(
                  field.type || "",
                )
                  ? " full"
                  : "")
              }
              key={field.key}
            >
              {field.section && (
                <h3 className="ad-field-section">{field.section}</h3>
              )}
              <div className="ad-field">
                <label htmlFor={"field-" + field.key}>
                  {field.label}
                  {field.required && <span> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={"field-" + field.key}
                    className="ad-input"
                    rows={4}
                    {...form.register(field.key)}
                    aria-invalid={!!form.formState.errors[field.key]}
                    aria-describedby={"hint-" + field.key}
                  />
                ) : field.type === "select" ? (
                  <select
                    className="ad-input"
                    id={"field-" + field.key}
                    {...form.register(field.key)}
                    aria-invalid={!!form.formState.errors[field.key]}
                    aria-describedby={"hint-" + field.key}
                  >
                    {!field.required && <option value="">Not provided</option>}
                    {field.options?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : field.type === "toggle" ? (
                  <Controller
                    control={form.control}
                    name={field.key}
                    render={({ field: f }) => (
                      <button
                        id={"field-" + field.key}
                        className="ad-switch"
                        type="button"
                        role="switch"
                        aria-checked={!!f.value}
                        aria-describedby={"hint-" + field.key}
                        onClick={() => f.onChange(!f.value)}
                      >
                        <span />
                      </button>
                    )}
                  />
                ) : field.type === "image" ? (
                  <Controller
                    control={form.control}
                    name={field.key}
                    render={({ field: f }) => (
                      <MediaPicker
                        id={"field-" + field.key}
                        value={String(f.value || "")}
                        onChange={f.onChange}
                      />
                    )}
                  />
                ) : field.type === "list" ? (
                  <Controller
                    control={form.control}
                    name={field.key}
                    render={({ field: f }) => (
                      <div className="ad-list-editor" id={"field-" + field.key}>
                        {(Array.isArray(f.value) ? f.value : []).map((v, i) => (
                          <div key={i}>
                            <Input
                              className="ad-input"
                              aria-label={`${field.label} ${i + 1}`}
                              value={v}
                              onChange={(e) =>
                                f.onChange(
                                  (f.value as string[]).map((old, j) =>
                                    j === i ? e.target.value : old,
                                  ),
                                )
                              }
                            />
                            <button
                              type="button"
                              className="ad-icon-button"
                              aria-label={`Remove ${field.label} ${i + 1}`}
                              onClick={() =>
                                f.onChange(
                                  (f.value as string[]).filter(
                                    (_, j) => j !== i,
                                  ),
                                )
                              }
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="ad-btn secondary small"
                          onClick={() =>
                            f.onChange([
                              ...(Array.isArray(f.value) ? f.value : []),
                              "",
                            ])
                          }
                        >
                          <Plus size={14} />
                          Add item
                        </button>
                      </div>
                    )}
                  />
                ) : field.type === "multi" ? (
                  <Controller
                    control={form.control}
                    name={field.key}
                    render={({ field: f }) => (
                      <fieldset className="ad-multi" id={"field-" + field.key}>
                        <legend className="sr-only">{field.label}</legend>
                        {field.options?.map((o) => (
                          <label key={o}>
                            <Input
                              type="checkbox"
                              checked={
                                Array.isArray(f.value) && f.value.includes(o)
                              }
                              onChange={(e) =>
                                f.onChange(
                                  e.target.checked
                                    ? [
                                        ...(Array.isArray(f.value)
                                          ? f.value
                                          : []),
                                        o,
                                      ]
                                    : (Array.isArray(f.value)
                                        ? f.value
                                        : []
                                      ).filter((v) => v !== o),
                                )
                              }
                            />
                            {o}
                          </label>
                        ))}
                      </fieldset>
                    )}
                  />
                ) : field.type === "color" ? (
                  <Controller
                    control={form.control}
                    name={field.key}
                    render={({ field: f }) => (
                      <Input
                        id={"field-" + field.key}
                        type="color"
                        value={String(f.value || "#1479b8").toLowerCase()}
                        onChange={f.onChange}
                        onBlur={f.onBlur}
                        ref={f.ref}
                        aria-describedby={"hint-" + field.key}
                      />
                    )}
                  />
                ) : (
                  <Input
                    className="ad-input"
                    id={"field-" + field.key}
                    type={
                      field.type === "email"
                        ? "email"
                        : field.type === "date"
                          ? "date"
                          : field.type === "number"
                            ? "number"
                            : "text"
                    }
                    {...form.register(
                      field.key,
                      field.type === "number"
                        ? { setValueAs: (v) => (v === "" ? "" : Number(v)) }
                        : {},
                    )}
                    aria-invalid={!!form.formState.errors[field.key]}
                    aria-describedby={"hint-" + field.key}
                    required={field.required}
                  />
                )}
                <div id={"hint-" + field.key}>
                  {field.hint && <small>{field.hint}</small>}
                  {field.max && (
                    <small className="ad-character-count">
                      {String(values[field.key] || "").length} / {field.max}
                    </small>
                  )}
                  {form.formState.errors[field.key] && (
                    <span className="ad-field-error" role="alert">
                      {String(form.formState.errors[field.key]?.message)}
                    </span>
                  )}
                </div>
                {field.type === "slug" && (
                  <button
                    type="button"
                    className="ad-text-button"
                    onClick={() =>
                      form.setValue(
                        field.key,
                        String(values.title || "")
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, ""),
                        { shouldValidate: true },
                      )
                    }
                  >
                    Generate from title
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {extra}
        <div className="ad-editor-actions">
          {showPreview && (
            <button
              type="button"
              className="ad-btn secondary"
              onClick={() => setPreview(true)}
            >
              <Eye size={15} />
              Preview
            </button>
          )}
          <button
            type="submit"
            className="ad-btn"
            disabled={form.formState.isSubmitting}
          >
            <Save size={15} />
            {submitLabel}
          </button>
        </div>
      </form>
      <LocalPreview
        title="Content preview"
        open={preview}
        onClose={() => setPreview(false)}
        values={{ ...values, ...previewExtra }}
        fields={fields}
      />
    </>
  );
}
