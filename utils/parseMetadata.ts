import { load } from "../deps.ts";
import { MetadataResult } from "../types/metadata.ts";

export function parseMetadata(raw: string): MetadataResult {
  const METADATA_REGEX = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m;
  const match = raw.match(METADATA_REGEX);

  if (!match) {
    return {
      metadata: {},
      content: raw,
    };
  }

  const [, yamlRaw, content] = match;

  const metadata = load(yamlRaw);
  return { metadata, content };
}
