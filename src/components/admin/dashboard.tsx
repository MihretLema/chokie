"use client";
import Link from "next/link";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  Inbox,
  CalendarDays,
  GraduationCap,
  Headset,
  Layers3,
  Handshake,
  Plus,
  ArrowRight,
  Download,
  Clock3,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { PageTitle, StatusBadge } from "./primitives";
import { chartData } from "@/lib/admin/mock-data";
import { downloadCsv } from "./data-table";
const colors = [
  "#1479b8",
  "#8bc34a",
  "#77b4d5",
  "#b7cad7",
  "#e0e8ee",
  "#45637b",
];
export function Dashboard() {
  const { data } = useDemo();
  const [range, setRange] = useState("Last 7 days");
  const contacts = data.collections.inquiries || [],
    consultations = data.collections.consultations || [],
    tickets = data.collections.support || [],
    registrations = data.collections.registrations || [];
  const metrics = [
    {
      label: "Contact inquiries",
      value: contacts.length,
      note: "Total demo inquiries",
      icon: Inbox,
      href: "inquiries",
    },
    {
      label: "Consultation requests",
      value: consultations.filter((r) => r.values.status === "New").length,
      note: "New in demo workspace",
      icon: CalendarDays,
      href: "consultations",
    },
    {
      label: "Training registrations",
      value: registrations.length,
      note: "Synthetic inquiries",
      icon: GraduationCap,
      href: "registrations",
    },
    {
      label: "Open support tickets",
      value: tickets.filter(
        (r) => !["Resolved", "Closed"].includes(String(r.values.status)),
      ).length,
      note: "Awaiting resolution",
      icon: Headset,
      href: "support",
    },
    {
      label: "Published services",
      value: (data.collections.services || []).filter(
        (r) => r.values.status === "Published",
      ).length,
      note: "Local publication state",
      icon: Layers3,
      href: "services",
    },
    {
      label: "Active partners",
      value: (data.collections.partners || []).filter(
        (r) =>
          r.values.verification === "Verified" &&
          r.values.approved &&
          r.values.status === "Published",
      ).length,
      note: "Verified & approved in demo",
      icon: Handshake,
      href: "partners",
    },
  ];
  const support = [
    "New",
    "Open",
    "In Progress",
    "Waiting for Customer",
    "Resolved",
    "Closed",
  ].map((name) => ({
    name,
    value: tickets.filter((r) => r.values.status === name).length,
  }));
  const interest = ["CISSP", "PMP", "CISA", "CISM"].map((name) => ({
    name,
    value: registrations.filter((r) => r.values.category === name).length,
  }));
  const chart = range === "Last 3 days" ? chartData.slice(-3) : chartData;
  return (
    <>
      <PageTitle
        eyebrow="YOUR WORKSPACE AT A GLANCE"
        title="Welcome back, Administrator"
        description="Here’s an overview of your website activity and business inquiries."
        actions={
          <>
            <button
              className="ad-btn secondary"
              onClick={() =>
                downloadCsv(
                  "demo-overview.csv",
                  metrics.map((m) => ({
                    metric: m.label,
                    value: m.value,
                    data: "Synthetic demo",
                  })),
                )
              }
            >
              <Download size={15} />
              Export overview
            </button>
            <Link className="ad-btn" href="/admin/pages">
              <Plus size={16} />
              Manage content
            </Link>
          </>
        }
      />
      <div className="ad-overview-note">
        <span className="ad-live-dot" /> All figures below are demonstration
        data. Your public website is unchanged.
        <span className="ad-note-right">LOCAL WORKSPACE</span>
      </div>
      <div className="ad-stat-grid">
        {metrics.map((m, i) => (
          <Link href={"/admin/" + m.href} className="ad-stat" key={m.label}>
            <div>
              <span>{m.label}</span>
              <span className={"ad-stat-icon tone-" + i}>
                <m.icon size={19} />
              </span>
            </div>
            <strong>{m.value.toString().padStart(2, "0")}</strong>
            <p>
              {m.note}
              <ArrowUpRight size={13} />
            </p>
          </Link>
        ))}
      </div>
      <div className="ad-chart-grid">
        <section className="ad-panel ad-inquiry-chart">
          <div className="ad-panel-heading">
            <div>
              <h2>Inquiry activity</h2>
              <p>A week of illustrative website conversations</p>
            </div>
            <label className="ad-sr-label">
              <span className="sr-only">Chart period</span>
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option>Last 7 days</option>
                <option>Last 3 days</option>
              </select>
            </label>
          </div>
          <div className="ad-chart-legend">
            <span>
              <i style={{ background: colors[0] }} />
              Contact inquiries
            </span>
            <span>
              <i style={{ background: colors[1] }} />
              Consultations
            </span>
            <small>Demo chart</small>
          </div>
          <div
            className="ad-chart"
            role="img"
            aria-label={
              "Synthetic inquiry activity: " +
              chart
                .map(
                  (d) =>
                    `${d.day}, ${d.inquiries} inquiries and ${d.consultations} consultations`,
                )
                .join("; ")
            }
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={chart}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="inquiryFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1479b8" stopOpacity={0.16} />
                    <stop offset="100%" stopColor="#1479b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eaf0f4" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#627489" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#627489" }}
                />
                <Tooltip />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="inquiries"
                  stroke="#1479b8"
                  strokeWidth={2.5}
                  fill="url(#inquiryFill)"
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="consultations"
                  stroke="#81b64b"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="ad-panel">
          <div className="ad-panel-heading">
            <div>
              <h2>Support at a glance</h2>
              <p>Tickets by status · demo</p>
            </div>
            <Link href="/admin/support" aria-label="View support tickets">
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div
            className="ad-donut"
            role="img"
            aria-label={support.map((s) => s.name + ": " + s.value).join(", ")}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  isAnimationActive={false}
                  data={support}
                  dataKey="value"
                  innerRadius={61}
                  outerRadius={82}
                  paddingAngle={4}
                >
                  {support.map((s, i) => (
                    <Cell key={s.name} fill={colors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div>
              <strong>{tickets.length}</strong>
              <span>demo tickets</span>
            </div>
          </div>
          <div className="ad-status-legend">
            {support.map((s, i) => (
              <div key={s.name}>
                <i style={{ background: colors[i] }} />
                <span>{s.name}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="ad-chart-grid equal">
        <section className="ad-panel">
          <div className="ad-panel-heading">
            <div>
              <h2>Consultation requests</h2>
              <p>Illustrative daily requests · demo</p>
            </div>
            <CalendarDays size={18} />
          </div>
          <div
            className="ad-chart compact"
            role="img"
            aria-label={
              "Synthetic consultation requests: " +
              chart.map((d) => d.day + ": " + d.consultations).join(", ")
            }
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chart} margin={{ left: -25, right: 0 }}>
                <CartesianGrid vertical={false} stroke="#edf1f5" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar
                  isAnimationActive={false}
                  dataKey="consultations"
                  fill="#1479b8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={25}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="ad-panel">
          <div className="ad-panel-heading">
            <div>
              <h2>Training interest</h2>
              <p>Synthetic program inquiries</p>
            </div>
            <Link
              href="/admin/registrations"
              aria-label="View training registrations"
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="ad-interest">
            {interest.map((t, i) => (
              <div key={t.name}>
                <span className="ad-training-icon">
                  <GraduationCap size={17} />
                </span>
                <div>
                  <span>
                    {t.name}
                    <strong>{t.value} inquiries</strong>
                  </span>
                  <div className="ad-progress">
                    <i
                      style={{
                        width:
                          (registrations.length
                            ? (t.value / registrations.length) * 100
                            : 0) + "%",
                        background: colors[i],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="ad-panel ad-recent">
        <div className="ad-panel-heading">
          <div>
            <h2>Recent activity</h2>
            <p>The latest changes across your demo workspace</p>
          </div>
          <Link className="ad-text-link" href="/admin/activity">
            View all activity <ArrowRight size={14} />
          </Link>
        </div>
        <div className="ad-table-scroll">
          <table className="ad-table">
            <thead>
              <tr>
                {["Activity", "Type", "User", "Date", "Status"].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.activity.slice(0, 5).map((a) => (
                <tr key={a.id}>
                  <td>
                    <span className="ad-activity-icon">
                      <Clock3 size={15} />
                    </span>
                    {a.action}
                  </td>
                  <td>{a.resource}</td>
                  <td>{a.user}</td>
                  <td>
                    {new Date(a.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}
                  </td>
                  <td>
                    <StatusBadge value={a.result} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="ad-quick-links">
        <Link href="/admin/homepage">
          <Layers3 size={20} />
          <div>
            <strong>Make your homepage shine</strong>
            <span>Review content and section order</span>
          </div>
          <ArrowUpRight size={18} />
        </Link>
        <Link href="/admin/notifications">
          <Inbox size={20} />
          <div>
            <strong>Keep your team in the loop</strong>
            <span>Review workspace notifications</span>
          </div>
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </>
  );
}
