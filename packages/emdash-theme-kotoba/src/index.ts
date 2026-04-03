import { emailPlugin } from "../../emdash-theme-kotoba-plugin-email/src/index.ts";
import { thumbhashPlugin } from "../../emdash-theme-kotoba-plugin-thumbhash/src/index.ts";

export type ThemeOptions = {
  email?: Parameters<typeof emailPlugin>[0];
  thumbhash?: Parameters<typeof thumbhashPlugin>[0];
};

export function createKotobaTheme(options: ThemeOptions = {}) {
  return {
    name: "emdash-theme-kotoba",
    framework: "astro",
    base: "emdash",
    plugins: [emailPlugin(options.email), thumbhashPlugin(options.thumbhash)],
  };
}

export { emailPlugin, thumbhashPlugin };
