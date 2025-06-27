export function validateSlug(slug: string): boolean {
  // simple regex: only letters, numbers, dashes, underscores
  return /^[a-zA-Z0-9-_]+$/.test(slug);
}

export function validatePostContent(content: string): boolean {
  return content.trim().length > 0;
}

export function isValidTags(tags: unknown): tags is string[] {
  return (
    Array.isArray(tags) &&
    tags.every((tag) => typeof tag === "string" && tag.trim().length > 0)
  );
}

