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
    plugins: [emailPlugin(options.email ?? {}), metricsPlugin(options.metrics), thumbhashPlugin(options.thumbhash)],
    integrations: [kotobaAstroIntegration(options.astro)],
  }
}

export { emailPlugin, metricsPlugin, thumbhashPlugin }
export { kotobaAstroIntegration }
export type { KotobaThemeOptions }
