import {
  queryCategories,
  queryPagesByCollection,
  queryPosts,
  queryTags,
} from "./sitemapSources.ts";

export async function queryPagesForSitemap() {
  const [posts, pages, categories, tags] = await Promise.all([
    queryPosts(),
    queryPagesByCollection(),
    queryCategories(),
    queryTags(),
  ]);

  const staticRoutes = ["/", "/posts", "/categories", "/tags", "/archives", "/search"];
  const postRoutes = posts.map((post) => `/posts/${post.id}`);
  const pageRoutes = pages.map((page) => `/${page.id}`);
  const categoryRoutes = categories.map((category) => `/cats/${category.slug}`);
  const tagRoutes = tags.map((tag) => `/tags/${tag.slug}`);

  return [
    ...new Set([...staticRoutes, ...postRoutes, ...pageRoutes, ...categoryRoutes, ...tagRoutes]),
  ];
}
