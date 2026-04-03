import node from '@astrojs/node'
import react from '@astrojs/react'
import { auditLogPlugin } from '@emdash-cms/plugin-audit-log'
import { defineConfig } from 'astro/config'
import { createKotobaTheme } from 'emdash-theme-kotoba'
import emdash, { local } from 'emdash/astro'
import { sqlite } from 'emdash/db'

const kotobaTheme = createKotobaTheme({
  email: {
    provider: 'Zeabur',
    apiKeyEnvVar: 'KOTOBA_EMAIL_API_KEY',
    subjectPrefix: '[Kotoba] ',
  },
  metrics: {
    namespace: 'demo',
  },
  astro: {
    siteTitle: 'Kotoba Demo',
    siteDescription: 'Demo site using emdash-theme-kotoba',
    features: {
      comments: true,
      metrics: true,
      feed: true,
      sitemap: true,
      search: true,
    },
  },
})

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [
    react(),
    ...kotobaTheme.integrations,
    emdash({
      database: sqlite({ url: 'file:./data.db' }),
      storage: local({
        directory: './uploads',
        baseUrl: '/_emdash/api/media/file',
      }),
      plugins: [...kotobaTheme.plugins, auditLogPlugin()],
    }),
  ],
  devToolbar: { enabled: false },
})
