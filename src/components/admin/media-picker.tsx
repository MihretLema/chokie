"use client";
import { useState } from "react";
import { ImagePlus, Check, ImageOff } from "lucide-react";
import { useDemo } from "./demo-provider";
import { AdminDialog } from "./primitives";
export function MediaPicker({
  value,
  onChange,
  label = "Select image",
  id,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data } = useDemo();
  return (
    <div className="ad-image-picker">
      <div className="ad-image-picker-preview">
        {value ? (
          <img src={value} alt="Selected image preview" />
        ) : (
          <ImageOff size={24} />
        )}
      </div>
      <div>
        <button
          id={id}
          type="button"
          className="ad-btn secondary small"
          onClick={() => setOpen(true)}
        >
          <ImagePlus size={15} />
          {label}
        </button>
        {value && (
          <button
            type="button"
            className="ad-text-button"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        )}
        <small>Choose an existing or locally selected image.</small>
      </div>
      <AdminDialog
        open={open}
        onOpenChange={setOpen}
        title="Choose an image"
        description="Select a demo library asset. Add local images through Media Library."
        wide
      >
        <div className="ad-media-picker-grid">
          {data.media.map((asset) => (
            <button
              type="button"
              key={asset.id}
              className={value === asset.url ? "selected" : ""}
              onClick={() => {
                onChange(asset.url);
                setOpen(false);
              }}
            >
              <img src={asset.url} alt={asset.name} />
              <span>
                {asset.name}
                {value === asset.url && <Check size={14} />}
              </span>
            </button>
          ))}
        </div>
      </AdminDialog>
    </div>
  );
}
