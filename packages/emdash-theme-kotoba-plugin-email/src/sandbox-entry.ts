import { definePlugin } from "emdash";
import type { PluginContext } from "emdash";
import {
  buildEmailDetailsUrl,
  buildZeaburPayload,
  isDeliveryConfirmed,
  shouldRetry,
} from "./zeabur.js";

type StringMap = Record<string, unknown>;

type EmailBaseMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type EmailBeforeSendEvent = {
  message: EmailBaseMessage;
  source: string;
};

type EmailDeliverEvent = {
  message: EmailBaseMessage;
  source: string;
};

type EmailAfterSendEvent = {
  message: EmailBaseMessage;
  source: string;
};

type ProviderEmailMessage = EmailBaseMessage & {
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
  from?: string;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: unknown[];
  headers?: Record<string, string>;
  tags?: Record<string, string>;
} & StringMap;

type EmailPluginRuntimeOptions = {
  endpoint?: string;
  apiKeyEnvVar?: string;
  defaultFrom?: string;
  subjectPrefix?: string;
};

export default definePlugin({
  hooks: {
    "email:beforeSend": {
      handler: async ({ message }: EmailBeforeSendEvent, ctx: PluginContext) => {
        const options = readOptions(ctx);

        const providerMessage = message as ProviderEmailMessage;
        const subject = withSubjectPrefix(providerMessage.subject, options.subjectPrefix);
        const text = resolveText(providerMessage.text, providerMessage.html);
        const html = resolveHtml(providerMessage.html, text);
        const from = providerMessage.from || options.defaultFrom;

        if (!from) {
          throw new Error("Email sender is required");
        }

        return {
          ...providerMessage,
          from,
          subject,
          text,
          html,
        };
      },
    },
    "email:deliver": {
      exclusive: true,
      handler: async ({ message, source }: EmailDeliverEvent, ctx: PluginContext) => {
        const options = readOptions(ctx);
        if (!ctx.http) {
          throw new Error("network:fetch capability is required");
        }
        const http = ctx.http;

        const endpoint = options.endpoint || DEFAULT_ZEABUR_ENDPOINT;
        const apiKey = readApiKey(options.apiKeyEnvVar);
        if (!apiKey) {
          throw new Error("Email API key is required");
        }

        const payload = buildZeaburPayload(message as ProviderEmailMessage);
        const response = await sendWithRetry(
          async () =>
            http.fetch(endpoint, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify(payload),
            }),
          MAX_RETRIES,
        );

        if (!response.ok) {
          const body = await response.text().catch(() => "");
          throw new Error(
            `Email delivery failed (${response.status}) source=${source} detail=${body.slice(0, 300)}`,
          );
        }
        const result = (await response.json().catch(() => ({}))) as { id?: string };
        if (result.id) {
          await ctx.kv.set(
            buildDeliveryLookupKey({ message: message as ProviderEmailMessage, source }),
            result.id,
          );
        }

        const recipient = readRecipient((message as ProviderEmailMessage).to);
        if (recipient) {
          ctx.log.info(`Delivered email to {E}${recipient}{/E}`, { source });
        } else {
          ctx.log.info("Delivered email", { source });
        }
      },
    },
    "email:afterSend": {
      handler: async ({ message, source }: EmailAfterSendEvent, ctx: PluginContext) => {
        const options = readOptions(ctx);
        if (!ctx.http) return;

        const apiKey = readApiKey(options.apiKeyEnvVar);
        if (!apiKey) return;

        const zeaburId =
          ((await ctx.kv.get(
            buildDeliveryLookupKey({ message: message as ProviderEmailMessage, source }),
          )) as string | null) || null;
        if (!zeaburId) return;

        const detailsUrl = buildEmailDetailsUrl(
          options.endpoint || DEFAULT_ZEABUR_ENDPOINT,
          zeaburId,
        );
        const detailsResponse = await ctx.http.fetch(detailsUrl, {
          method: "GET",
          headers: { authorization: `Bearer ${apiKey}` },
        });

        if (!detailsResponse.ok) {
          ctx.log.warn("Unable to verify Zeabur delivery status", {
            source,
            status: detailsResponse.status,
            emailId: zeaburId,
          });
          return;
        }

        const details = (await detailsResponse.json().catch(() => ({}))) as {
          status?: string;
        };
        if (!isDeliveryConfirmed(details.status)) {
          ctx.log.error("Zeabur email status indicates non-success state", {
            source,
            emailId: zeaburId,
            status: details.status || "unknown",
          });
        }
      },
    },
  },
});

function readOptions(ctx: PluginContext): EmailPluginRuntimeOptions {
  const pluginWithOptions = ctx.plugin as PluginContext["plugin"] & {
    options?: EmailPluginRuntimeOptions;
  };
  const options = pluginWithOptions.options ?? {};
  return options;
}

function readApiKey(envVarName = "KOTOBA_EMAIL_API_KEY"): string | undefined {
  if (!envVarName) return undefined;
  const value = globalThis.process?.env?.[envVarName] ?? undefined;
  if (!value) return undefined;
  return value;
}

function withSubjectPrefix(subject?: string, prefix?: string): string {
  const finalSubject = subject?.trim() || "(no subject)";
  if (!prefix) return finalSubject;
  return `${prefix}${finalSubject}`;
}

function resolveText(text?: string, html?: string): string {
  if (text && text.trim().length > 0) return text;
  if (html && html.trim().length > 0) return html;
  return "";
}

function resolveHtml(html?: string, text?: string): string {
  if (html && html.trim().length > 0) return html;
  return text || "";
}

function readRecipient(to: ProviderEmailMessage["to"]): string | null {
  if (Array.isArray(to)) return to[0] ?? null;
  if (typeof to === "string") return to;
  return null;
}

function buildDeliveryLookupKey(event: { message: ProviderEmailMessage; source: string }): string {
  const recipient = readRecipient(event.message.to) || "unknown";
  const subject = (event.message.subject || "").slice(0, 120);
  return `zeabur:delivery:${event.source}:${recipient}:${subject}`;
}

const DEFAULT_ZEABUR_ENDPOINT = "https://api.zeabur.com/api/v1/zsend/emails";
const MAX_RETRIES = 3;

async function sendWithRetry(run: () => Promise<Response>, maxRetries: number): Promise<Response> {
  let attempt = 0;
  for (;;) {
    const response = await run();
    if (!shouldRetry(response.status) || attempt >= maxRetries - 1) {
      return response;
    }
    attempt += 1;
    await sleep(attempt * 300);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
