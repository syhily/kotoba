# Kotoba Theme

This repository builds a theme ecosystem based on `emdash` and `astro`, including:

- One main theme package
- Two plugin packages (`email`, `thumbhash`) used as sub-dependencies of the theme package
- One demo app for local testing only (not published to npm)

## Project Structure

```text
.
├─ apps/
│  └─ demo/                                 # Demo app (private, not published)
├─ packages/
│  ├─ emdash-theme-kotoba/                  # Main theme package
│  ├─ emdash-theme-kotoba-plugin-email/     # Email plugin package
│  └─ emdash-theme-kotoba-plugin-thumbhash/ # Thumbhash plugin package
└─ package.json                             # Monorepo root config
```

## Development Commands

```bash
vp run ready
vp run dev
vp run -r build
```
