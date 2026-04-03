import type { EmailPluginOptions } from 'emdash-theme-kotoba-plugin-email'
import type { MetricsPluginOptions } from 'emdash-theme-kotoba-plugin-metrics'
import type { ThumbhashPluginOptions } from 'emdash-theme-kotoba-plugin-thumbhash'

import { emailPlugin } from 'emdash-theme-kotoba-plugin-email'
import { metricsPlugin } from 'emdash-theme-kotoba-plugin-metrics'
import { thumbhashPlugin } from 'emdash-theme-kotoba-plugin-thumbhash'

import type { KotobaThemeOptions } from './options/types.ts'

import { kotobaAstroIntegration } from './integration/astro.ts'

export type ThemeOptions = {
  email?: EmailPluginOptions
  metrics?: MetricsPluginOptions
  thumbhash?: ThumbhashPluginOptions
  astro?: KotobaThemeOptions
}

export function createKotobaTheme(options: ThemeOptions = {}) {
  return {
    name: 'emdash-theme-kotoba',
    framework: 'astro',
    base: 'emdash',
    plugins: [
      options.email && emailPlugin(options.email),
      options.metrics && metricsPlugin(options.metrics),
      options.thumbhash && thumbhashPlugin(options.thumbhash),
    ].filter((plugin) => plugin !== undefined),
    integrations: [kotobaAstroIntegration(options.astro)],
  }
}

export { emailPlugin, metricsPlugin, thumbhashPlugin }
export { kotobaAstroIntegration }
export type { KotobaThemeOptions }
