# Kotoba Migration Runbook

## 1) Generate import manifest

From repo root:

```bash
node ./tools/import-yufan-content.mjs
```

This generates `tools/import-output/yufan-content-manifest.json`.

## 2) Validate manifest

- Ensure all post/page markdown files are included.
- Confirm `collection` inference for `posts/pages/categories/tags/friends`.
- Spot check `frontmatter` for required fields (`title`, `date`, `category`, `tags`).

## 3) Import into Emdash

- Use your Emdash seed/import path to ingest manifest-backed content.
- Import sequence:
  1. taxonomies (`categories`, `tags`)
  2. documents (`pages`)
  3. posts (`posts`)
  4. supporting content (`friends`)

## 4) Cutover checks

- Route checks:
  - `/`
  - `/posts/[slug]`
  - `/[slug]`
  - `/cats/[slug]`
  - `/tags/[slug]`
  - `/search/<keyword>`
  - `/feed`, `/feed/atom`
  - `/sitemap.xml`
- Behavior checks:
  - comments render and submit
  - metrics view/like endpoints return counts
  - OG endpoint responds

## 5) Rollback

- Keep legacy `yufan.me` deployment available during initial rollout.
- Roll back by disabling `kotobaAstroIntegration` and restoring old routes.
