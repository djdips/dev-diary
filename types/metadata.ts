export interface Metadata {
  title?: string;
  date?: string;       // Ideally ISO date string
  tags?: string[];     // Array of strings
  [key: string]: unknown;
}

export interface MetadataResult {
  metadata: Record<string, Metadata>;
  content: string;
}