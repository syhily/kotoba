import { describe, expect, it } from "vite-plus/test";

import { createKotobaTheme } from "./index.ts";

describe("createKotobaTheme", () => {
  it("returns astro-based theme with integration and plugins", () => {
    const theme = createKotobaTheme({});
    expect(theme.name).toBe("emdash-theme-kotoba");
    expect(theme.framework).toBe("astro");
    expect(theme.base).toBe("emdash");
    expect(Array.isArray(theme.plugins)).toBe(true);
    expect(Array.isArray(theme.integrations)).toBe(true);
    expect(theme.plugins.length).toBeGreaterThanOrEqual(3);
  });
});
