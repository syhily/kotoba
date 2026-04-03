import type { PluginDescriptor } from "emdash";

export type MetricsPluginOptions = {
  namespace?: string;
};

export function metricsPlugin(options: MetricsPluginOptions = {}): PluginDescriptor {
  return {
    id: "kotoba-metrics",
    version: "0.1.0",
    format: "standard",
    entrypoint: "emdash-theme-kotoba-plugin-metrics/sandbox",
    options: {
      namespace: options.namespace ?? "kotoba",
    },
    capabilities: ["kv:read", "kv:write"],
    allowedHosts: [],
  };
}
