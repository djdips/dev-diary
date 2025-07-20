export interface Metadata {
  title?: string;
  date?: string | Date;       // Ideally ISO date string
  tags?: string[];     // Array of strings
  [key: string]: unknown;
}

export interface MetadataResult {
  metadata: Metadata;
  content: string;
}