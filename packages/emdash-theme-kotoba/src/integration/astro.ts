import type { AstroIntegration } from "astro";
import { resolveKotobaOptions } from "../options/defaults.ts";
import type { KotobaThemeOptions } from "../options/types.ts";
import { validateKotobaOptions } from "../options/validate.ts";

type InjectRouteArgs = {
  pattern: string;
  entrypoint: URL;
  prerender?: boolean;
};

export function kotobaAstroIntegration(options: KotobaThemeOptions = {}): AstroIntegration {
  validateKotobaOptions(options);
  const resolved = resolveKotobaOptions(options);

  return {
    name: "emdash-theme-kotoba",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        const coreRoutes: InjectRouteArgs[] = [
          {
            pattern: resolved.routes.home,
            entrypoint: new URL("../routes/index.astro", import.meta.url),
          },
          {
            pattern: resolved.routes.posts,
            entrypoint: new URL("../routes/posts/index.astro", import.meta.url),
          },
          {
            pattern: `${resolved.routes.posts}/[slug]`,
            entrypoint: new URL("../routes/posts/[slug].astro", import.meta.url),
          },
          {
            pattern: "/[slug]",
            entrypoint: new URL("../routes/[slug].astro", import.meta.url),
          },
          {
            pattern: resolved.routes.categories,
            entrypoint: new URL("../routes/cats/index.astro", import.meta.url),
          },
          {
            pattern: `${resolved.routes.categories}/[slug]`,
            entrypoint: new URL("../routes/cats/[slug].astro", import.meta.url),
          },
          {
            pattern: resolved.routes.tags,
            entrypoint: new URL("../routes/tags/index.astro", import.meta.url),
          },
          {
            pattern: `${resolved.routes.tags}/[slug]`,
            entrypoint: new URL("../routes/tags/[slug].astro", import.meta.url),
          },
        ];

        for (const route of coreRoutes) {
          injectRoute(route);
        }

        if (resolved.features.search) {
          injectRoute({
            pattern: resolved.routes.search,
            entrypoint: new URL("../routes/search/index.astro", import.meta.url),
          });
          injectRoute({
            pattern: `${resolved.routes.search}/[keyword]`,
            entrypoint: new URL("../routes/search/[keyword].astro", import.meta.url),
          });
        }

        if (resolved.features.metrics) {
          injectRoute({
            pattern: "/_kotoba/api/metrics/view",
            entrypoint: new URL("../routes/_kotoba/api/metrics/view.ts", import.meta.url),
            prerender: false,
          });
          injectRoute({
            pattern: "/_kotoba/api/metrics/like",
            entrypoint: new URL("../routes/_kotoba/api/metrics/like.ts", import.meta.url),
            prerender: false,
          });
        }

        if (resolved.features.feed) {
          injectRoute({
            pattern: resolved.routes.feed,
            entrypoint: new URL("../routes/feed/index.ts", import.meta.url),
            prerender: false,
          });
          injectRoute({
            pattern: `${resolved.routes.feed}/atom`,
            entrypoint: new URL("../routes/feed/atom/index.ts", import.meta.url),
            prerender: false,
          });
          injectRoute({
            pattern: `${resolved.routes.categories}/[slug]/feed`,
            entrypoint: new URL("../routes/cats/[slug]/feed/index.ts", import.meta.url),
            prerender: false,
          });
          injectRoute({
            pattern: `${resolved.routes.tags}/[slug]/feed`,
            entrypoint: new URL("../routes/tags/[slug]/feed/index.ts", import.meta.url),
            prerender: false,
          });
        }

        if (resolved.features.sitemap) {
          injectRoute({
            pattern: resolved.routes.sitemap,
            entrypoint: new URL("../routes/sitemap.xml.ts", import.meta.url),
            prerender: false,
          });
          injectRoute({
            pattern: "/archives",
            entrypoint: new URL("../routes/archives/index.astro", import.meta.url),
          });
          injectRoute({
            pattern: "/images/og/[slug].png",
            entrypoint: new URL("../routes/images/og/[slug].png.ts", import.meta.url),
            prerender: false,
          });
        }

        injectRoute({
          pattern: "/wp-login.php",
          entrypoint: new URL("../routes/wp-login.php.astro", import.meta.url),
        });
        injectRoute({
          pattern: "/wp-admin",
          entrypoint: new URL("../routes/wp-admin/index.astro", import.meta.url),
        });
        injectRoute({
          pattern: "/wp-admin/install.php",
          entrypoint: new URL("../routes/wp-admin/install.php.astro", import.meta.url),
        });
        injectRoute({
          pattern: "/page/[num]",
          entrypoint: new URL("../routes/page/[num].astro", import.meta.url),
        });
        injectRoute({
          pattern: `${resolved.routes.categories}/[slug]/page/[num]`,
          entrypoint: new URL("../routes/cats/[slug]/page/[num].astro", import.meta.url),
        });
        injectRoute({
          pattern: `${resolved.routes.tags}/[slug]/page/[num]`,
          entrypoint: new URL("../routes/tags/[slug]/page/[num].astro", import.meta.url),
        });
      },
    },
  };
}
