"use client";
import { useState } from "react";
import { Plus, ShieldCheck, MessageSquare, Paperclip } from "lucide-react";
import type {
  AdminRecord,
  EditorValues,
  ModuleConfig,
} from "@/lib/admin/types";
import { modules } from "@/lib/admin/config";
import { editorSchema } from "@/lib/admin/validation";
import { useDemo } from "@/components/admin/demo-provider";
import {
  PageTitle,
  AdminDialog,
  ConfirmDialog,
  StatusBadge,
} from "@/components/admin/primitives";
import { ContentEditor, LocalPreview } from "@/components/admin/content-editor";
import { DataTable } from "@/components/admin/data-table";
import { permissions } from "@/lib/admin/mock-data";
function CustomerDetail({
  record,
  config,
  onEdit,
}: {
  record: AdminRecord;
  config: ModuleConfig;
  onEdit: () => void;
}) {
  const { data, upsert, notify } = useDemo();
  const [message, setMessage] = useState("");
  const [note, setNote] = useState(false);
  const current =
    (data.collections[config.key] || []).find((r) => r.id === record.id) ||
    record;
  const timeline = Array.isArray(current.values.timeline)
    ? current.values.timeline
    : [];
  const attachments = Array.isArray(current.values.attachments)
    ? current.values.attachments
    : [];
  function reply() {
    if (message.trim().length < 5) {
      notify("Enter at least 5 characters for the demo message.");
      return;
    }
    upsert(config.key, {
      ...current,
      updatedAt: new Date().toISOString(),
      values: {
        ...current.values,
        timeline: [
          ...timeline,
          `${new Date().toISOString()} | ${note ? "Internal note" : "Demo reply — not sent"} | ${message.trim()}`,
        ],
      },
    });
    setMessage("");
  }
  return (
    <>
      <div className="ad-detail-grid">
        {config.fields
          .filter((f) => !["message", "notes"].includes(f.key))
          .map((f) => (
            <div key={f.key}>
              <h3>{f.label}</h3>
              {f.key === "status" || f.key === "priority" ? (
                <StatusBadge value={current.values[f.key]} />
              ) : (
                <p>{String(current.values[f.key] ?? "") || "Not provided"}</p>
              )}
            </div>
          ))}
      </div>
      <section className="ad-workflow-panel ad-panel">
        <h3>
          {config.key === "support" ? "Ticket description" : "Customer message"}
        </h3>
        <p>{String(current.values.message || "Not provided")}</p>
        <h3 style={{ marginTop: 22 }}>Internal notes</h3>
        <p>{String(current.values.notes || "No internal notes yet.")}</p>
        <button
          className="ad-btn secondary small"
          onClick={onEdit}
          style={{ marginTop: 18 }}
        >
          Update status, notes & assignment
        </button>
      </section>
      {config.key === "support" && (
        <>
          <section className="ad-workflow-panel ad-panel">
            <h3>Conversation timeline</h3>
            <div className="ad-inline-note">
              Replies are added to this demo timeline only. No customer receives
              a message.
            </div>
            <ol className="ad-timeline">
              <li>
                <strong>Ticket created · synthetic customer</strong>
                <p>{String(current.values.message)}</p>
                <small>{String(current.values.date)}</small>
              </li>
              {timeline.map((entry, i) => {
                const [date, type, ...text] = entry.split(" | ");
                return (
                  <li key={i}>
                    <strong>{type}</strong>
                    <p>{text.join(" | ")}</p>
                    <small>{date}</small>
                  </li>
                );
              })}
            </ol>
            <label className="ad-field">
              <span>{note ? "Internal note" : "Demo reply"}</span>
              <textarea
                className="ad-input"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a local demo message…"
              />
            </label>
            <label className="ad-checkbox-label">
              <input
                type="checkbox"
                checked={note}
                onChange={(e) => setNote(e.target.checked)}
              />{" "}
              Internal note
            </label>
            <button className="ad-btn" onClick={reply}>
              <MessageSquare size={14} />
              Add to demo timeline
            </button>
          </section>
          <section className="ad-workflow-panel ad-panel">
            <h3>Attachments</h3>
            <p>Local file references only; files are not uploaded or stored.</p>
            <ul>
              {attachments.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
            <label className="ad-btn secondary small">
              <Paperclip size={14} />
              Select attachment
              <input
                className="sr-only"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    upsert(config.key, {
                      ...current,
                      updatedAt: new Date().toISOString(),
                      values: {
                        ...current.values,
                        attachments: [...attachments, file.name],
                      },
                    });
                }}
              />
            </label>
          </section>
        </>
      )}
      <section className="ad-workflow-panel ad-panel">
        <h3>Activity history</h3>
        <ol className="ad-timeline">
          {data.activity
            .filter(
              (a) => a.resource === config.key && a.recordId === current.id,
            )
            .slice(0, 6)
            .map((a) => (
              <li key={a.id}>
                <strong>{a.action}</strong>
                <small>
                  {a.user} ·{" "}
                  {new Date(a.date).toLocaleString("en-US", {
                    timeZone: "America/Los_Angeles",
                  })}
                </small>
              </li>
            ))}
        </ol>
        {!data.activity.some(
          (a) => a.resource === config.key && a.recordId === current.id,
        ) && <p>No local updates to this module yet.</p>}
      </section>
    </>
  );
}
export function CollectionManager({
  module,
  initialRecord,
}: {
  module: string;
  initialRecord?: string;
}) {
  const config = modules[module];
  const { data, upsert, remove, notify } = useDemo();
  const [editor, setEditor] = useState<AdminRecord | "new" | null>(null);
  const [view, setView] = useState<AdminRecord | null>(
    (data.collections[module] || []).find((r) => r.id === initialRecord) ||
      null,
  );
  const [deleting, setDeleting] = useState<string[]>([]);
  const [roles, setRoles] = useState(false);
  const records = [...(data.collections[module] || [])];
  if (config.fields.some((f) => f.key === "order"))
    records.sort(
      (a, b) => Number(a.values.order || 0) - Number(b.values.order || 0),
    );
  function save(values: EditorValues) {
    if (
      values.slug &&
      records.some(
        (r) =>
          r.values.slug === values.slug &&
          r.id !== (editor && editor !== "new" ? editor.id : ""),
      )
    ) {
      notify(
        "This URL slug is already in use in the demo. Choose a unique slug.",
      );
      return;
    }
    upsert(module, {
      id:
        editor && editor !== "new"
          ? editor.id
          : module + "-" + crypto.randomUUID().slice(0, 8),
      updatedAt: new Date().toISOString(),
      values: {
        ...(editor && editor !== "new" ? editor.values : {}),
        ...values,
      },
    });
    setEditor(null);
  }
  function bulk(ids: string[], status: string) {
    let blocked = 0;
    for (const record of records.filter((r) => ids.includes(r.id))) {
      const values = { ...record.values, status };
      if (!editorSchema(config.fields, module).safeParse(values).success) {
        blocked++;
        continue;
      }
      upsert(module, {
        ...record,
        updatedAt: new Date().toISOString(),
        values,
      });
    }
    if (blocked)
      notify(
        `${blocked} record(s) were not changed because validation or publication approval is missing.`,
      );
  }
  function reorder(record: AdminRecord, direction: number) {
    const index = records.findIndex((r) => r.id === record.id),
      next = index + direction;
    if (next < 0 || next >= records.length) {
      notify(
        "This record is already at the " +
          (direction < 0 ? "beginning." : "end."),
      );
      return;
    }
    const swapped = [...records];
    [swapped[index], swapped[next]] = [swapped[next], swapped[index]];
    swapped.forEach((r, i) => {
      if (Number(r.values.order) !== i + 1)
        upsert(module, {
          ...r,
          updatedAt: new Date().toISOString(),
          values: { ...r.values, order: i + 1 },
        });
    });
  }
  return (
    <>
      <PageTitle
        eyebrow={config.group.toUpperCase()}
        title={config.title}
        description={config.description}
        actions={
          <>
            {module === "users" && (
              <button
                className="ad-btn secondary"
                onClick={() => setRoles(true)}
              >
                <ShieldCheck size={15} />
                View permissions
              </button>
            )}
            <button className="ad-btn" onClick={() => setEditor("new")}>
              <Plus size={16} />
              {config.customer
                ? "Add demo record"
                : "Create " + config.singular.toLowerCase()}
            </button>
          </>
        }
      />
      <div className="ad-collection-summary">
        <span>
          {records.length}{" "}
          {config.customer ? "synthetic records" : "demo records"}
        </span>
        <span>Browser tab state · No live publication</span>
      </div>
      <DataTable
        records={records}
        columns={config.columns}
        statuses={config.statuses}
        onEdit={setEditor}
        onView={setView}
        onDelete={setDeleting}
        onBulkStatus={bulk}
        onReorder={
          config.fields.some((f) => f.key === "order") ? reorder : undefined
        }
        exportName={"demo-" + module}
      />
      <AdminDialog
        open={!!editor}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        title={`${editor === "new" ? "Create" : "Edit"} ${config.singular.toLowerCase()}`}
        description="Changes are kept in your browser tab. Public website content is not changed."
        wide
      >
        {editor && (
          <ContentEditor
            key={editor === "new" ? "new" : editor.id}
            module={module}
            fields={config.fields}
            initialValues={
              editor === "new"
                ? {
                    status: config.statuses?.[0] || "Draft",
                    order: records.length + 1,
                  }
                : editor.values
            }
            onSave={save}
          />
        )}
      </AdminDialog>
      {config.customer ? (
        <AdminDialog
          open={!!view}
          onOpenChange={(open) => {
            if (!open) setView(null);
          }}
          title={config.singular + " details · " + (view?.id || "")}
          description="Synthetic customer record. All updates and conversations stay in this demo."
          wide
        >
          {view && (
            <CustomerDetail
              key={view.id}
              record={view}
              config={config}
              onEdit={() => {
                setEditor(
                  (data.collections[module] || []).find(
                    (r) => r.id === view.id,
                  ) || view,
                );
                setView(null);
              }}
            />
          )}
        </AdminDialog>
      ) : (
        view && (
          <LocalPreview
            open={!!view}
            onClose={() => setView(null)}
            title={config.singular + " preview"}
            values={view.values}
            fields={config.fields}
          />
        )
      )}
      <ConfirmDialog
        open={deleting.length > 0}
        onClose={() => setDeleting([])}
        onConfirm={() => remove(module, deleting)}
        title={`Remove ${deleting.length} demo record${deleting.length === 1 ? "" : "s"}?`}
      />
      <AdminDialog
        open={roles}
        onOpenChange={setRoles}
        title="Role permissions"
        description="Phase 2 role design only. Real authorization will be implemented in Phase 3."
        wide
      >
        <div className="ad-permissions">
          {Object.entries(permissions).map(([role, items]) => (
            <article key={role}>
              <h3>{role}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </AdminDialog>
    </>
  );
}
