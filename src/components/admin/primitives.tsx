"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X, TriangleAlert, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
export function StatusBadge({ value }: { value: unknown }) {
  const text =
    typeof value === "boolean"
      ? value
        ? "Approved"
        : "Pending"
      : String(value || "Not provided");
  const tone = [
    "Published",
    "Active",
    "Approved",
    "Verified",
    "Resolved",
    "Completed",
    "Read",
  ].includes(text)
    ? "green"
    : ["High", "Critical", "Cancelled", "Inactive", "Unverified"].includes(text)
      ? "red"
      : [
            "New",
            "Open",
            "In Review",
            "Scheduled",
            "In Progress",
            "Unread",
          ].includes(text)
        ? "blue"
        : "gray";
  return <span className={"ad-badge " + tone}>{text}</span>;
}
export function AdminDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ad-overlay" />
        <Dialog.Content className={"ad-dialog" + (wide ? " wide" : "")}>
          <div className="ad-dialog-head">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>
                {description ||
                  "Development preview. Changes stay in this browser tab."}
              </Dialog.Description>
            </div>
            <Dialog.Close className="ad-icon-button" aria-label="Close dialog">
              <X size={19} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Remove demo record?",
  description = "This removes the selected content from this local demo. You can restore the original examples using Reset demo.",
  confirmLabel = "Remove from demo",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
}) {
  return (
    <AdminDialog
      open={open}
      onOpenChange={onClose}
      title={title}
      description={description}
    >
      <div className="ad-confirm-icon">
        <TriangleAlert />
      </div>
      <div className="ad-dialog-actions">
        <button className="ad-btn secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="ad-btn danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </AdminDialog>
  );
}
export function AdminEmpty({
  title = "Nothing here yet",
  text = "Add a record to start building your content library.",
  action,
}: {
  title?: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ad-empty">
      <Inbox size={32} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function AdminLoading() {
  return (
    <div className="ad-loading" role="status">
      <LoaderCircle size={24} />
      <span>Preparing your demo workspace…</span>
      <div className="ad-skeleton-row">
        {[1, 2, 3].map((i) => (
          <div className="ad-skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="ad-page-title">
      <div>
        {eyebrow && <span className="ad-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="ad-title-actions">{actions}</div>}
    </div>
  );
}
