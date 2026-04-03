# emdash-theme-kotoba-plugin-email

Email provider/interceptor plugin for EmDash, adapted for Zeabur Email REST API.

## What this plugin implements

- `email:beforeSend` interceptor (`email:intercept` capability):
  - fills `from` from plugin options when absent
  - applies `subjectPrefix`
  - ensures `html`/`text` fallback
- `email:deliver` provider (`email:provide` capability, exclusive hook):
  - sends request to Zeabur `POST /api/v1/zsend/emails`
  - uses `ctx.http.fetch` (`network:fetch` capability)
- `email:afterSend` verification (`email:intercept` capability):
  - uses Zeabur `GET /api/v1/zsend/emails/:id` to verify final send state
  - treats `pending`, `sent`, `delivered` as success states

Zeabur API reference: [REST API Reference](https://zeabur.com/docs/en-US/email/rest-api)

## Register in `astro.config.ts`

This example follows the same style as `apps/demo/astro.config.ts`.

```diff
+ import { emailPlugin } from "emdash-theme-kotoba-plugin-email";

 export default defineConfig({
   integrations: [
     emdash({
       plugins: [
+        emailPlugin({
+          endpoint: "https://api.zeabur.com/api/v1/zsend/emails",
+          apiKey: "zs_your_api_key_here",
+          defaultFrom: "no-reply@example.com",
+          subjectPrefix: "[Kotoba] ",
+        }),
       ],
     }),
   ],
 });
```

`endpoint` is optional. If omitted, plugin default is:

`https://api.zeabur.com/api/v1/zsend/emails`

## Field mapping (EmDash -> Zeabur)

- `message.from` -> `from` (required)
- `message.to` -> `to` (always normalized to array, required)
- `message.subject` -> `subject` (required)
- `message.html` -> `html` (optional, but `html` or `text` required)
- `message.text` -> `text` (optional, but `html` or `text` required)
- `message.cc` -> `cc` (optional)
- `message.bcc` -> `bcc` (optional)
- `message.reply_to` -> `reply_to` (optional)
- `message.headers` -> `headers` (optional)
- `message.tags` -> `tags` (optional)
- `message.attachments` -> `attachments` (optional)

## Notes

- The plugin retries transient delivery failures (`429`, `5xx`) with bounded backoff.
- Recipient identifiers in logs are marked as `{E}...{/E}`.
- API keys and full email body are never logged.
