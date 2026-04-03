import type { KotobaFeatureFlags, KotobaPaginationOptions, KotobaRouteOptions, KotobaThemeOptions } from './types.ts'

export type ResolvedKotobaThemeOptions = {
  siteTitle: string
  siteDescription: string
  basePath: string
  pagination: KotobaPaginationOptions
  features: KotobaFeatureFlags
  routes: KotobaRouteOptions
}

export const defaultPagination: KotobaPaginationOptions = {
  postsPerPage: 10,
  tagsPerPage: 20,
  categoriesPerPage: 20,
  searchPerPage: 10,
}

export const defaultFeatures: KotobaFeatureFlags = {
  search: true,
  feed: true,
  sitemap: true,
  metrics: true,
  comments: true,
}

export const defaultRoutes: KotobaRouteOptions = {
  home: '/',
  posts: '/posts',
  pages: '/',
  categories: '/cats',
  tags: '/tags',
  archives: '/archives',
  search: '/search',
  feed: '/feed',
  sitemap: '/sitemap.xml',
}

export function resolveKotobaOptions(options: KotobaThemeOptions = {}): ResolvedKotobaThemeOptions {
  return {
    siteTitle: options.siteTitle ?? 'Kotoba',
    siteDescription: options.siteDescription ?? 'Built with Emdash and Astro',
    basePath: options.basePath ?? '',
    pagination: {
      ...defaultPagination,
      ...options.pagination,
    },
    features: {
      ...defaultFeatures,
      ...options.features,
    },
    routes: {
      ...defaultRoutes,
      ...options.routes,
    },
  }
}
