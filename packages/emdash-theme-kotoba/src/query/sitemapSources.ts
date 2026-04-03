import { getEmDashCollection, getTaxonomyTerms } from 'emdash'

export async function queryPosts() {
  const result = await getEmDashCollection('posts', {
    orderBy: { published_at: 'desc' },
  })
  return result.entries
}

export async function queryPagesByCollection() {
  const result = await getEmDashCollection('pages')
  return result.entries
}

export async function queryCategories() {
  return getTaxonomyTerms('category')
}

export async function queryTags() {
  return getTaxonomyTerms('tag')
}
