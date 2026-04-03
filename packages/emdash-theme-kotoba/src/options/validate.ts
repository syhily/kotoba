import type { KotobaThemeOptions } from './types.ts'

function assertPositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`[emdash-theme-kotoba] ${field} must be a positive integer.`)
  }
}

export function validateKotobaOptions(options: KotobaThemeOptions) {
  if (options.basePath && !options.basePath.startsWith('/')) {
    throw new Error("[emdash-theme-kotoba] basePath must start with '/'.")
  }

  if (options.pagination) {
    const p = options.pagination
    if (p.postsPerPage !== undefined) assertPositiveInteger(p.postsPerPage, 'pagination.postsPerPage')
    if (p.tagsPerPage !== undefined) assertPositiveInteger(p.tagsPerPage, 'pagination.tagsPerPage')
    if (p.categoriesPerPage !== undefined) {
      assertPositiveInteger(p.categoriesPerPage, 'pagination.categoriesPerPage')
    }
    if (p.searchPerPage !== undefined) assertPositiveInteger(p.searchPerPage, 'pagination.searchPerPage')
  }
}
