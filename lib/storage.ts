import { Metadata } from "../types/metadata.ts";

export interface StorageAdapter {
  listSlugs(): Promise<string[]>;
  getPost(slug: string): Promise<string | null>;
  getMetadata(slug: string): Promise<Metadata | null>;
  getPostsByTag(tag: string): Promise<string[]>;
  savePost(slug: string, content: string): Promise<void>;
  deletePost(slug: string): Promise<void>;
  searchPosts(query: string): Promise<string[]>;
}
