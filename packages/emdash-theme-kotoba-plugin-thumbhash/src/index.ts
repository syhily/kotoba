export type ThumbhashPluginOptions = {
  quality?: "low" | "medium" | "high";
};

export function thumbhashPlugin(options: ThumbhashPluginOptions = {}) {
  return {
    name: "emdash-theme-kotoba-plugin-thumbhash",
    options,
  };
}
