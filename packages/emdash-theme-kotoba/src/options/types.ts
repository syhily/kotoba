export type KotobaPaginationOptions = {
  postsPerPage: number
  tagsPerPage: number
  categoriesPerPage: number
  searchPerPage: number
}

export type KotobaFeatureFlags = {
  search: boolean
  feed: boolean
  sitemap: boolean
  metrics: boolean
  comments: boolean
}

export type KotobaRouteOptions = {
  home: string
  posts: string
  pages: string
  categories: string
  tags: string
  archives: string
  search: string
  feed: string
  sitemap: string
}

export type KotobaThemeOptions = {
  siteTitle?: string
  siteDescription?: string
  basePath?: string
  pagination?: Partial<KotobaPaginationOptions>
  features?: Partial<KotobaFeatureFlags>
  routes?: Partial<KotobaRouteOptions>
}
