"use client";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Pencil,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { AdminRecord, ColumnConfig } from "@/lib/admin/types";
import { StatusBadge, AdminEmpty } from "./primitives";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const cell = (value: unknown) => {
    let s = Array.isArray(value) ? value.join("; ") : String(value ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  const blob = new Blob(
    [
      "\ufeff" +
        [
          keys.map(cell).join(","),
          ...rows.map((r) => keys.map((k) => cell(r[k])).join(",")),
        ].join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8;" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function display(value: unknown, key: string) {
  if (key === "icon") {
    const Icon = Icons[String(value) as keyof typeof Icons] as
      LucideIcon | undefined;
    return (
      <span className="ad-table-service-icon">
        {Icon ? <Icon size={18} /> : <Icons.Layers3 size={18} />}
      </span>
    );
  }
  if (
    [
      "status",
      "verification",
      "approved",
      "featured",
      "priority",
      "result",
    ].includes(key)
  )
    return <StatusBadge value={value} />;
  if (key === "updatedAt")
    return new Date(String(value)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    });
  if (key === "image")
    return value ? (
      <img className="ad-table-thumb" src={String(value)} alt="Selected logo" />
    ) : (
      <span className="ad-muted">No asset</span>
    );
  return (
    <span title={String(value ?? "")}>
      {Array.isArray(value)
        ? value.join(", ")
        : String(value ?? "") || "Not provided"}
    </span>
  );
}
export function DataTable({
  records,
  columns: spec,
  statuses,
  onEdit,
  onView,
  onDelete,
  onReorder,
  onBulkStatus,
  exportName = "demo-records",
  categoryKey,
  onSelectLabel = "record",
}: {
  records: AdminRecord[];
  columns: ColumnConfig[];
  statuses?: string[];
  onEdit?: (record: AdminRecord) => void;
  onView?: (record: AdminRecord) => void;
  onDelete?: (ids: string[]) => void;
  onReorder?: (record: AdminRecord, direction: number) => void;
  onBulkStatus?: (ids: string[], status: string) => void;
  exportName?: string;
  categoryKey?: string;
  onSelectLabel?: string;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [category, setCategory] = useState("All categories");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [bulkStatus, setBulkStatus] = useState("");
  const categories = [
    ...new Set(
      records
        .map((r) => String(r.values[categoryKey || "category"] || ""))
        .filter(Boolean),
    ),
  ];
  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (status === "All statuses" || r.values.status === status) &&
          (category === "All categories" ||
            r.values[categoryKey || "category"] === category),
      ),
    [records, status, category, categoryKey],
  );
  const columns = useMemo<ColumnDef<AdminRecord>[]>(
    () => [
      ...(onDelete || onBulkStatus
        ? [
            {
              id: "select",
              enableSorting: false,
              header: ({
                table,
              }: {
                table: ReturnType<typeof useReactTable<AdminRecord>>;
              }) => (
                <input
                  type="checkbox"
                  aria-label={"Select all visible " + onSelectLabel + "s"}
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
              ),
              cell: ({
                row,
              }: {
                row: import("@tanstack/react-table").Row<AdminRecord>;
              }) => (
                <input
                  type="checkbox"
                  aria-label={
                    "Select " +
                    (row.original.values.title ||
                      row.original.values.name ||
                      row.original.id)
                  }
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              ),
            },
          ]
        : []),
      ...spec.map((col): ColumnDef<AdminRecord> => ({
        id: col.key,
        accessorFn: (r) =>
          col.key === "id"
            ? r.id
            : col.key === "updatedAt"
              ? r.updatedAt
              : r.values[col.key],
        header: col.label,
        cell: (info) => display(info.getValue(), col.key),
      })),
      ...(onEdit || onView || onDelete
        ? [
            {
              id: "actions",
              header: "Actions",
              enableSorting: false,
              cell: ({
                row,
              }: {
                row: import("@tanstack/react-table").Row<AdminRecord>;
              }) => (
                <div className="ad-row-actions">
                  {onEdit && (
                    <button
                      className="ad-icon-button"
                      aria-label={
                        "Edit " +
                        (row.original.values.title ||
                          row.original.values.name ||
                          row.original.id)
                      }
                      onClick={() => onEdit(row.original)}
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                  <details className="ad-row-menu">
                    <summary aria-label={"More actions for " + row.original.id}>
                      <MoreHorizontal size={18} />
                    </summary>
                    <div>
                      {onView && (
                        <button
                          onClick={(e) => {
                            e.currentTarget
                              .closest("details")
                              ?.removeAttribute("open");
                            onView(row.original);
                          }}
                        >
                          <Eye size={14} />
                          View / preview
                        </button>
                      )}
                      {onReorder && (
                        <>
                          <button onClick={() => onReorder(row.original, -1)}>
                            <ArrowUp size={14} />
                            Move up
                          </button>
                          <button onClick={() => onReorder(row.original, 1)}>
                            <ArrowDown size={14} />
                            Move down
                          </button>
                        </>
                      )}
                      {onDelete && (
                        <button
                          className="ad-danger-text"
                          onClick={() => onDelete([row.original.id])}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  </details>
                </div>
              ),
            },
          ]
        : []),
    ],
    [spec, onEdit, onView, onDelete, onReorder, onBulkStatus, onSelectLabel],
  );
  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter: search, sorting, rowSelection: selected },
    onGlobalFilterChange: setSearch,
    onSortingChange: setSorting,
    onRowSelectionChange: setSelected,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    initialState: { pagination: { pageSize: 8 } },
    globalFilterFn: (row, _id, value) =>
      [row.original.id, ...Object.values(row.original.values)]
        .join(" ")
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  });
  const ids = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original.id);
  const total = table.getFilteredRowModel().rows.length;
  return (
    <div className="ad-panel ad-data-panel">
      <div className="ad-table-toolbar">
        <label className="ad-table-search">
          <Search size={16} />
          <input
            aria-label="Search records"
            placeholder="Search records…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="ad-filter-actions">
          {statuses && (
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
          {categories.length > 1 && (
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}
          <button
            className="ad-btn secondary small"
            disabled={!total}
            onClick={() =>
              downloadCsv(
                exportName + ".csv",
                table.getFilteredRowModel().rows.map((r) => ({
                  id: r.original.id,
                  ...r.original.values,
                  dataSource: "Local demo",
                })),
              )
            }
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>
      {ids.length > 0 && (
        <div className="ad-bulk-bar">
          <span>{ids.length} selected</span>
          {onBulkStatus && statuses && (
            <>
              <select
                aria-label="Bulk status"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                <option value="">Set status…</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                className="ad-btn small secondary"
                disabled={!bulkStatus}
                onClick={() => {
                  onBulkStatus(ids, bulkStatus);
                  setSelected({});
                }}
              >
                Apply
              </button>
            </>
          )}
          {onDelete && (
            <button
              className="ad-btn small danger"
              onClick={() => onDelete(ids)}
            >
              Delete selected
            </button>
          )}
          <button className="ad-text-button" onClick={() => setSelected({})}>
            Clear
          </button>
        </div>
      )}
      <div className="ad-table-scroll">
        <table className="ad-table">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="ad-sort"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <ArrowUpDown size={11} />
                        <span className="sr-only">
                          {header.column.getIsSorted() || "Sort"}
                        </span>
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={row.getIsSelected() ? "selected" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!total && (
        <AdminEmpty
          title="No matching records"
          text={
            records.length
              ? "Try another search or clear your filters."
              : "No records have been added to this local demo yet."
          }
        />
      )}
      <div className="ad-pagination">
        <span>
          {total
            ? table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
              1
            : 0}
          –
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            total,
          )}{" "}
          of {total} records
        </span>
        <label>
          Rows{" "}
          <select
            aria-label="Rows per page"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[8, 15, 30].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <div>
          <button
            className="ad-icon-button"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={17} />
          </button>
          <span>
            {table.getState().pagination.pageIndex + 1} /{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <button
            className="ad-icon-button"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
