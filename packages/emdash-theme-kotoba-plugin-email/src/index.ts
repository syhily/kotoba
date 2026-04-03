import type { PluginDescriptor } from "emdash";

export type EmailPluginOptions = {
  provider?: "Zeabur";
  endpoint?: string;
  apiKeyEnvVar?: string;
  defaultFrom?: string;
  subjectPrefix?: string;
};

export function emailPlugin(options: EmailPluginOptions): PluginDescriptor {
  const endpoint = options.endpoint || DEFAULT_ZEABUR_ENDPOINT;
  const endpointHost = safeHost(endpoint);

  return {
    id: "kotoba-email",
    version: "0.1.0",
    format: "standard",
    entrypoint: "emdash-theme-kotoba-plugin-email/sandbox",
    options: {
      provider: options.provider ?? "Zeabur",
      endpoint,
      apiKeyEnvVar: options.apiKeyEnvVar,
      defaultFrom: options.defaultFrom,
      subjectPrefix: options.subjectPrefix,
    },
    capabilities: ["email:provide", "email:intercept", "network:fetch"],
    allowedHosts: endpointHost ? [endpointHost] : [],
  };
}

const DEFAULT_ZEABUR_ENDPOINT = "https://api.zeabur.com/api/v1/zsend/emails";

function safeHost(endpoint: string): string | null {
  try {
    return new URL(endpoint).host;
  } catch {
    return null;
  }
}
