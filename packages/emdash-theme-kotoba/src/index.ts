import { emailPlugin } from "../../emdash-theme-kotoba-plugin-email/src/index.ts";
import { metricsPlugin } from "../../emdash-theme-kotoba-plugin-metrics/src/index.ts";
import { thumbhashPlugin } from "../../emdash-theme-kotoba-plugin-thumbhash/src/index.ts";
import { kotobaAstroIntegration } from "./integration/astro.ts";
import type { KotobaThemeOptions } from "./options/types.ts";

export type ThemeOptions = {
  email?: Parameters<typeof emailPlugin>[0];
  metrics?: Parameters<typeof metricsPlugin>[0];
  thumbhash?: Parameters<typeof thumbhashPlugin>[0];
  astro?: KotobaThemeOptions;
};

export function createKotobaTheme(options: ThemeOptions = {}) {
  return {
    name: "emdash-theme-kotoba",
    framework: "astro",
    base: "emdash",
    plugins: [
      emailPlugin(options.email ?? {}),
      metricsPlugin(options.metrics),
      thumbhashPlugin(options.thumbhash),
    ],
    integrations: [kotobaAstroIntegration(options.astro)],
  };
}

export { emailPlugin, metricsPlugin, thumbhashPlugin };
export { kotobaAstroIntegration };
export type { KotobaThemeOptions };
