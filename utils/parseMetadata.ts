import { load } from "../deps.ts"
import { Metadata, MetadataResult } from "../types/metadata.ts"

export function parseMetadata(raw: string): MetadataResult {
    const METADATA_REGEX = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m
    const match = raw.match(METADATA_REGEX)

    if (!match) {
        return {
            metadata: {},
            content: raw,
        }
    }

    const [, yamlRaw, content] = match

    const metadata = load(yamlRaw) as Metadata

    if (metadata.date) {
        if (metadata.date instanceof Date) {
            metadata.date = metadata.date.toISOString()
        } else if (typeof metadata.date === "string") {
            // Optional: normalize string dates to ISO if possible
            const parsedDate = new Date(metadata.date)
            if (!isNaN(parsedDate.getTime())) {
                metadata.date = parsedDate.toISOString()
            }
        }
    }

    console.log("Parsed metadata:", metadata)

    return { metadata, content }
}
