"use client";
import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useDemo } from "@/components/admin/demo-provider";
import { PageTitle, AdminEmpty } from "@/components/admin/primitives";
import { DataTable } from "@/components/admin/data-table";
import { AdminTabs } from "@/components/admin/tabs";
export function Notifications() {
  const { data, upsert } = useDemo();
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All categories");
  const records = data.collections.notifications || [];
  const categories = [
    ...new Set(records.map((r) => String(r.values.category))),
  ];
  const shown = records.filter(
    (r) =>
      (filter === "All" ||
        (filter === "Unread" ? !r.values.read : !!r.values.read)) &&
      (category === "All categories" || r.values.category === category),
  );
  return (
    <>
      <PageTitle
        eyebrow="ADMINISTRATION"
        title="Notification center"
        description="A clear view of what needs your attention. All notifications are synthetic examples."
        actions={
          <button
            className="ad-btn secondary"
            onClick={() =>
              records
                .filter((r) => !r.values.read)
                .forEach((r) =>
                  upsert("notifications", {
                    ...r,
                    values: { ...r.values, read: true, status: "Read" },
                    updatedAt: new Date().toISOString(),
                  }),
                )
            }
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        }
      />
      <div className="ad-media-toolbar">
        <AdminTabs
          tabs={["All", "Unread", "Read"]}
          value={filter}
          onChange={setFilter}
          label="Notification status"
          panelId="notification-list"
        />
        <label>
          <span className="sr-only">Notification category</span>
          <select
            className="ad-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div
        className="ad-notification-list"
        id="notification-list"
        role="tabpanel"
        aria-labelledby={"tab-" + filter}
      >
        {shown.map((r) => (
          <article
            key={r.id}
            className={
              "ad-notification-item " + (!r.values.read ? "unread" : "")
            }
          >
            <Bell size={19} />
            <div>
              <h2>{String(r.values.title)}</h2>
              <p>{String(r.values.message)}</p>
              <small>
                {String(r.values.category)} · {String(r.values.date)} · Demo
                notification
              </small>
            </div>
            <button
              className="ad-btn secondary small"
              onClick={() =>
                upsert("notifications", {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  values: {
                    ...r.values,
                    read: !r.values.read,
                    status: r.values.read ? "Unread" : "Read",
                  },
                })
              }
            >
              Mark {r.values.read ? "unread" : "read"}
            </button>
          </article>
        ))}
      </div>
      {!shown.length && (
        <AdminEmpty
          title="You’re all caught up"
          text="There are no notifications matching this view."
        />
      )}
    </>
  );
}
export function ActivityLogs() {
  const { data } = useDemo();
  return (
    <>
      <PageTitle
        eyebrow="ADMINISTRATION"
        title="Activity logs"
        description="Follow changes in this demo workspace. These records are not production audit logs."
      />
      <DataTable
        records={data.activity.map((a) => ({
          id: a.id,
          updatedAt: a.date,
          values: {
            user: a.user,
            action: a.action,
            resource: a.resource,
            date: new Date(a.date).toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            }),
            result: a.result,
          },
        }))}
        columns={[
          { key: "user", label: "User" },
          { key: "action", label: "Action" },
          { key: "resource", label: "Resource" },
          { key: "date", label: "Timestamp · Pacific" },
          { key: "result", label: "Result" },
        ]}
        categoryKey="resource"
        exportName="demo-activity"
      />
    </>
  );
}
