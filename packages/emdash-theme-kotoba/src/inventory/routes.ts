export type RoutePriority = "core" | "enhanced" | "legacy";

export type RouteInventoryItem = {
  path: string;
  file: string;
  priority: RoutePriority;
  notes?: string;
};

export const routeInventory: RouteInventoryItem[] = [
  { path: "/", file: "src/pages/index.astro", priority: "core" },
  { path: "/posts/[slug]", file: "src/pages/posts/[slug].astro", priority: "core" },
  { path: "/[slug]", file: "src/pages/[slug].astro", priority: "core" },
  { path: "/posts", file: "src/pages/posts/index.astro", priority: "core" },
  { path: "/categories", file: "src/pages/categories/index.astro", priority: "core" },
  { path: "/cats", file: "src/pages/cats/index.astro", priority: "core" },
  { path: "/cats/[slug]", file: "src/pages/cats/[slug]/index.astro", priority: "core" },
  { path: "/tags", file: "src/pages/tags/index.astro", priority: "core" },
  { path: "/tags/[slug]", file: "src/pages/tags/[slug]/index.astro", priority: "core" },
  { path: "/archives", file: "src/pages/archives/index.astro", priority: "enhanced" },
  { path: "/search", file: "src/pages/search/index.astro", priority: "enhanced" },
  {
    path: "/search/[keyword]",
    file: "src/pages/search/[keyword]/index.astro",
    priority: "enhanced",
  },
  { path: "/feed", file: "src/pages/feed/index.ts", priority: "enhanced" },
  { path: "/feed/atom", file: "src/pages/feed/atom/index.ts", priority: "enhanced" },
  { path: "/cats/[slug]/feed", file: "src/pages/cats/[slug]/feed/index.ts", priority: "enhanced" },
  {
    path: "/cats/[slug]/feed/atom",
    file: "src/pages/cats/[slug]/feed/atom/index.ts",
    priority: "enhanced",
  },
  { path: "/tags/[slug]/feed", file: "src/pages/tags/[slug]/feed/index.ts", priority: "enhanced" },
  {
    path: "/tags/[slug]/feed/atom",
    file: "src/pages/tags/[slug]/feed/atom/index.ts",
    priority: "enhanced",
  },
  { path: "/sitemap.xml", file: "src/pages/sitemap.xml.ts", priority: "enhanced" },
  {
    path: "/images/og/[slug].png",
    file: "src/pages/images/og/[slug].png.ts",
    priority: "enhanced",
  },
  {
    path: "/images/calendar/[year]/[time].png",
    file: "src/pages/images/calendar/[year]/[time].png.ts",
    priority: "enhanced",
  },
  {
    path: "/images/avatar/[hash].png",
    file: "src/pages/images/avatar/[hash].png.ts",
    priority: "enhanced",
  },
  {
    path: "/page",
    file: "src/pages/page/index.astro",
    priority: "legacy",
    notes: "Legacy pagination URL from old site",
  },
  { path: "/page/[num]", file: "src/pages/page/[num].astro", priority: "legacy" },
  {
    path: "/cats/[slug]/page/index",
    file: "src/pages/cats/[slug]/page/index.astro",
    priority: "legacy",
  },
  {
    path: "/cats/[slug]/page/[num]",
    file: "src/pages/cats/[slug]/page/[num].astro",
    priority: "legacy",
  },
  {
    path: "/tags/[slug]/page/index",
    file: "src/pages/tags/[slug]/page/index.astro",
    priority: "legacy",
  },
  {
    path: "/tags/[slug]/page/[num]",
    file: "src/pages/tags/[slug]/page/[num].astro",
    priority: "legacy",
  },
  {
    path: "/search/[keyword]/page/index",
    file: "src/pages/search/[keyword]/page/index.astro",
    priority: "legacy",
  },
  {
    path: "/search/[keyword]/page/[num]",
    file: "src/pages/search/[keyword]/page/[num].astro",
    priority: "legacy",
  },
  {
    path: "/wp-admin",
    file: "src/pages/wp-admin/index.astro",
    priority: "legacy",
    notes: "Compatibility redirect endpoint",
  },
  {
    path: "/wp-admin/install.php",
    file: "src/pages/wp-admin/install.php.astro",
    priority: "legacy",
    notes: "Compatibility redirect endpoint",
  },
  {
    path: "/wp-login.php",
    file: "src/pages/wp-login.php.astro",
    priority: "legacy",
    notes: "Compatibility redirect endpoint",
  },
  { path: "/404", file: "src/pages/404.astro", priority: "legacy" },
  { path: "/500", file: "src/pages/500.astro", priority: "legacy" },
];
