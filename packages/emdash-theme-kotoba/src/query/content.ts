import { getEmDashCollection, getEmDashEntry, getEntriesByTerm, getTaxonomyTerms } from "emdash";

export async function queryPosts(limit?: number) {
  const result = await getEmDashCollection("posts", {
    orderBy: { published_at: "desc" },
    limit,
  });
  return result.entries;
}

export async function queryPostBySlug(slug: string) {
  const result = await getEmDashEntry("posts", slug);
  return result.entry;
}

export async function queryPageBySlug(slug: string) {
  const result = await getEmDashEntry("pages", slug);
  return result.entry;
}

export async function queryCategories() {
  return getTaxonomyTerms("category");
}

export async function queryTags() {
  return getTaxonomyTerms("tag");
}

export async function queryPostsByCategory(categorySlug: string) {
  return getEntriesByTerm("posts", "category", categorySlug);
}

export async function queryPostsByTag(tagSlug: string) {
  return getEntriesByTerm("posts", "tag", tagSlug);
}

export async function searchPostsByKeyword(keyword: string) {
  const lowered = keyword.trim().toLowerCase();
  if (!lowered) return [];
  const entries = await queryPosts();
  return entries.filter((post) => {
    const title = String(post.data.title ?? "").toLowerCase();
    const excerpt = String(post.data.excerpt ?? "").toLowerCase();
    return title.includes(lowered) || excerpt.includes(lowered);
  });
}
