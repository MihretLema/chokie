import type { AdminRepository, DemoState } from "./types";
export class DevelopmentRepository implements AdminRepository {
  private readonly key = "chokie-admin-demo-v2";
  async load(): Promise<DemoState> {
    if (process.env.NODE_ENV !== "development")
      throw new Error("Admin preview is disabled outside development.");
    const { createMockState } = await import("./mock-data");
    const raw = sessionStorage.getItem(this.key);
    if (raw) {
      try {
        const saved = JSON.parse(raw) as DemoState;
        if (
          saved.version === 2 &&
          saved.collections &&
          saved.documents &&
          saved.media &&
          saved.activity
        )
          return saved;
      } catch {
        /* Use a fresh demo if the old session cannot be read. */
      }
    }
    return createMockState();
  }
  async save(state: DemoState) {
    sessionStorage.setItem(this.key, JSON.stringify(state));
  }
  async reset() {
    sessionStorage.removeItem(this.key);
    return this.load();
  }
}
