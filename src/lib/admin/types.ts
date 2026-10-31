export type FieldValue = string | number | boolean | string[];
export type EditorValues = Record<string, FieldValue>;
export interface AdminRecord {
  id: string;
  updatedAt: string;
  values: EditorValues;
}
export interface FieldConfig {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "email"
    | "url"
    | "slug"
    | "number"
    | "date"
    | "select"
    | "toggle"
    | "list"
    | "image"
    | "multi"
    | "color";
  required?: boolean;
  options?: string[];
  hint?: string;
  max?: number;
  section?: string;
}
export interface ColumnConfig {
  key: string;
  label: string;
}
export interface ModuleConfig {
  key: string;
  title: string;
  singular: string;
  description: string;
  group: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  statuses?: string[];
  filterKey?: string;
  readonly?: boolean;
  customer?: boolean;
}
export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  local?: boolean;
}
export interface ActivityEvent {
  id: string;
  action: string;
  resource: string;
  user: string;
  date: string;
  result: string;
  recordId?: string;
}
export interface DemoState {
  version: 2;
  collections: Record<string, AdminRecord[]>;
  documents: Record<string, EditorValues>;
  media: MediaAsset[];
  activity: ActivityEvent[];
}
export interface AdminRepository {
  load(): Promise<DemoState>;
  save(state: DemoState): Promise<void>;
  reset(): Promise<DemoState>;
}
