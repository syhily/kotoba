import type { PluginDescriptor } from 'emdash'

export type ThumbhashPluginOptions = {
  quality?: 'low' | 'medium' | 'high'
}

export function thumbhashPlugin(options: ThumbhashPluginOptions = {}): PluginDescriptor {
  return {
    id: 'kotoba-thumbhash',
    version: '0.1.0',
    format: 'standard',
    entrypoint: 'emdash-theme-kotoba-plugin-thumbhash/sandbox',
    options: {
      quality: options.quality ?? 'medium',
    },
    capabilities: [],
    allowedHosts: [],
  }
}
