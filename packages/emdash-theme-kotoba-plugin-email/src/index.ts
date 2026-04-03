export type EmailPluginOptions = {
  provider?: "smtp" | "ses" | "resend";
};

export function emailPlugin(options: EmailPluginOptions = {}) {
  return {
    name: "emdash-theme-kotoba-plugin-email",
    options,
  };
}
