export type EmailMessage = {
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
};

export function buildZeaburPayload(message: EmailMessage): Record<string, unknown> {
  const from = message.from?.trim();
  const subject = message.subject?.trim();
  const to = normalizeRecipients(message.to);
  const cc = normalizeRecipients(message.cc);
  const bcc = normalizeRecipients(message.bcc);
  const replyTo = normalizeRecipients(message.reply_to);
  const text = message.text?.trim();
  const html = message.html?.trim();

  if (!from) throw new Error("Email sender is required");
  if (!subject) throw new Error("Email subject is required");
  if (to.length === 0) throw new Error("At least one recipient is required");
  if (!text && !html) throw new Error("Either text or html content is required");

  const payload: Record<string, unknown> = {
    from,
    to,
    subject,
  };
  if (html) payload.html = html;
  if (text) payload.text = text;
  if (cc.length > 0) payload.cc = cc;
  if (bcc.length > 0) payload.bcc = bcc;
  if (replyTo.length > 0) payload.reply_to = replyTo;
  if (Array.isArray(message.attachments) && message.attachments.length > 0) {
    payload.attachments = message.attachments;
  }
  if (message.headers && Object.keys(message.headers).length > 0) {
    payload.headers = message.headers;
  }
  if (message.tags && Object.keys(message.tags).length > 0) {
    payload.tags = message.tags;
  }

  return payload;
}

export function shouldRetry(status: number): boolean {
  return status === 429 || status >= 500;
}

export function buildEmailDetailsUrl(deliverEndpoint: string, emailId: string): string {
  const url = new URL(deliverEndpoint);
  const detailsPath = url.pathname.replace(/\/emails\/?$/, `/emails/${emailId}`);
  url.pathname = detailsPath;
  url.search = "";
  return url.toString();
}

export function isDeliveryConfirmed(status: string | undefined): boolean {
  if (!status) return false;
  const value = status.toLowerCase();
  return value === "pending" || value === "sent" || value === "delivered";
}

function normalizeRecipients(input: string | string[] | undefined): string[] {
  if (!input) return [];
  const raw = Array.isArray(input) ? input : [input];
  return raw.map((v) => v.trim()).filter((v) => v.length > 0);
}
