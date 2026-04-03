import { getEmDashCollection, getEmDashEntry, getEntryTerms, getTaxonomyTerms } from 'emdash'

import type { ThemePage, ThemePost, ThemePostWithMetadata, ThemeTaxonomy } from '../types/content.ts'

function toStringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function toDateOrNull(value: unknown): Date | null {
  return value instanceof Date ? value : null
}

export async function getPosts(): Promise<ThemePost[]> {
  const { entries } = await getEmDashCollection('posts', {
    orderBy: { published_at: 'desc' },
  })

  const posts = await Promise.all(
    entries.map(async (entry) => {
      const tags = await getEntryTerms('posts', entry.data.id, 'tag')
      const categoryTerms = await getEntryTerms('posts', entry.data.id, 'category')
      const category = categoryTerms[0]?.slug
      const cover =
        entry.data.featured_image && typeof entry.data.featured_image === 'object'
          ? toStringOrEmpty((entry.data.featured_image as Record<string, unknown>).src)
          : undefined

      return {
        id: entry.id,
        contentId: entry.data.id,
        title: toStringOrEmpty(entry.data.title) || entry.id,
        excerpt: toStringOrEmpty(entry.data.excerpt),
        content: entry.data.content,
        slug: entry.id,
        permalink: `/posts/${entry.id}`,
        publishedAt: toDateOrNull(entry.data.publishedAt),
        updatedAt: toDateOrNull(entry.data.updatedAt),
        visible: true,
        category,
        tags: tags.map((tag) => tag.slug),
        cover,
      } satisfies ThemePost
    }),
  )

  assertUniquePostSlugs(posts)
  return posts
}

export async function getPost(slug: string): Promise<ThemePost | undefined> {
  const { entry } = await getEmDashEntry('posts', slug)
  if (!entry) return undefined
  const tags = await getEntryTerms('posts', entry.data.id, 'tag')
  const categoryTerms = await getEntryTerms('posts', entry.data.id, 'category')
  return {
    id: entry.id,
    contentId: entry.data.id,
    title: toStringOrEmpty(entry.data.title) || entry.id,
    excerpt: toStringOrEmpty(entry.data.excerpt),
    content: entry.data.content,
    slug: entry.id,
    permalink: `/posts/${entry.id}`,
    publishedAt: toDateOrNull(entry.data.publishedAt),
    updatedAt: toDateOrNull(entry.data.updatedAt),
    visible: true,
    category: categoryTerms[0]?.slug,
    tags: tags.map((tag) => tag.slug),
  }
}

export async function getPages(): Promise<ThemePage[]> {
  const { entries } = await getEmDashCollection('pages', { orderBy: { updated_at: 'desc' } })
  const pages = entries.map(
    (entry) =>
      ({
        id: entry.id,
        contentId: entry.data.id,
        title: toStringOrEmpty(entry.data.title) || entry.id,
        content: entry.data.content,
        slug: entry.id,
        permalink: `/${entry.id}`,
        publishedAt: toDateOrNull(entry.data.publishedAt),
      }) satisfies ThemePage,
  )
  assertNoSlugCollisionWithPages(pages)
  return pages
}

export async function getPage(slug: string): Promise<ThemePage | undefined> {
  const { entry } = await getEmDashEntry('pages', slug)
  if (!entry) return undefined
  return {
    id: entry.id,
    contentId: entry.data.id,
    title: toStringOrEmpty(entry.data.title) || entry.id,
    content: entry.data.content,
    slug: entry.id,
    permalink: `/${entry.id}`,
    publishedAt: toDateOrNull(entry.data.publishedAt),
  }
}

export async function getCategories(): Promise<ThemeTaxonomy[]> {
  const categories = await getTaxonomyTerms('category')
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    label: category.label,
    count: category.count ?? 0,
    permalink: `/cats/${category.slug}`,
  }))
}

export async function getTags(): Promise<ThemeTaxonomy[]> {
  const tags = await getTaxonomyTerms('tag')
  return tags.map((tag) => ({
    id: tag.id,
    slug: tag.slug,
    label: tag.label,
    count: tag.count ?? 0,
    permalink: `/tags/${tag.slug}`,
  }))
}

export async function getPostsWithMetadata(posts: ThemePost[]): Promise<ThemePostWithMetadata[]> {
  return posts.map((post) => ({
    ...post,
    meta: {
      likes: 0,
      views: 0,
      comments: 0,
    },
  }))
}

function assertUniquePostSlugs(posts: ThemePost[]) {
  const slugs = new Set<string>()
  for (const post of posts) {
    if (slugs.has(post.slug)) {
      throw new Error(`[emdash-theme-kotoba] Duplicate post slug: ${post.slug}`)
    }
    slugs.add(post.slug)
  }
}

function assertNoSlugCollisionWithPages(pages: ThemePage[]) {
  const slugs = new Set<string>()
  for (const page of pages) {
    if (slugs.has(page.slug)) {
      throw new Error(`[emdash-theme-kotoba] Duplicate page slug: ${page.slug}`)
    }
    slugs.add(page.slug)
  }
}
