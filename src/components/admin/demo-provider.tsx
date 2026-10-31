"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AdminRecord,
  DemoState,
  EditorValues,
  MediaAsset,
} from "@/lib/admin/types";
import { DevelopmentRepository } from "@/lib/admin/repository";
type DemoContext = {
  data: DemoState;
  ready: boolean;
  error: string;
  toast: string;
  upsert: (module: string, record: AdminRecord) => void;
  remove: (module: string, ids: string[]) => void;
  saveDocument: (key: string, values: EditorValues, label?: string) => void;
  setMedia: (assets: MediaAsset[]) => void;
  reset: () => Promise<void>;
  notify: (message: string) => void;
  retry: () => void;
};
const blank: DemoState = {
  version: 2,
  collections: {},
  documents: {},
  media: [],
  activity: [],
};
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoState>(blank);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const repo = useRef(new DevelopmentRepository());
  const current = useRef(data);
  async function load() {
    setError("");
    try {
      const state = await repo.current.load();
      current.current = state;
      setData(state);
      setReady(true);
    } catch {
      setError(
        "Browser session storage is unavailable. Allow local storage for this site, then retry.",
      );
      setReady(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 6500);
    return () => clearTimeout(timer);
  }, [toast]);
  function commit(
    next: DemoState,
    action: string,
    resource: string,
    recordId?: string,
  ) {
    const state = {
      ...next,
      activity: [
        {
          id: crypto.randomUUID(),
          action,
          resource,
          user: String(next.documents.profile?.name || "Demo administrator"),
          date: new Date().toISOString(),
          result: "Local demo",
          recordId,
        },
        ...next.activity,
      ].slice(0, 100),
    };
    current.current = state;
    setData(state);
    void repo.current
      .save(state)
      .then(() => setToast(action + " — saved in this browser tab only."))
      .catch(() =>
        setToast(
          "Updated in memory only. Browser storage is full; reduce local media or reset the demo.",
        ),
      );
  }
  const value: DemoContext = {
    data,
    ready,
    error,
    toast,
    retry: () => void load(),
    notify: setToast,
    upsert: (module, record) => {
      const items = current.current.collections[module] || [];
      commit(
        {
          ...current.current,
          collections: {
            ...current.current.collections,
            [module]: items.some((r) => r.id === record.id)
              ? items.map((r) => (r.id === record.id ? record : r))
              : [record, ...items],
          },
        },
        "Updated " + module,
        module,
        record.id,
      );
    },
    remove: (module, ids) =>
      commit(
        {
          ...current.current,
          collections: {
            ...current.current.collections,
            [module]: (current.current.collections[module] || []).filter(
              (r) => !ids.includes(r.id),
            ),
          },
        },
        `Removed ${ids.length} demo record${ids.length === 1 ? "" : "s"}`,
        module,
      ),
    saveDocument: (key, values, label = "Saved demo draft") =>
      commit(
        {
          ...current.current,
          documents: { ...current.current.documents, [key]: values },
        },
        label,
        key,
      ),
    setMedia: (assets) =>
      commit(
        { ...current.current, media: assets },
        "Updated local media selection",
        "Media",
      ),
    reset: async () => {
      try {
        const state = await repo.current.reset();
        current.current = state;
        setData(state);
        setToast("Demo reset to its original sample state.");
      } catch {
        setToast("Could not reset browser session storage.");
      }
    },
  };
  return (
    <Context.Provider value={value}>
      {children}
      {toast && (
        <div className="ad-toast" role="status">
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("Admin components require DemoProvider.");
  return context;
}
