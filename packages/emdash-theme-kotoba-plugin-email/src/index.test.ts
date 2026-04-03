import { describe, expect, it } from 'vite-plus/test'

import { emailPlugin } from './index.js'
import { buildEmailDetailsUrl, buildZeaburPayload, isDeliveryConfirmed } from './zeabur.js'

describe('emailPlugin', () => {
  it('builds a standard descriptor with endpoint host allowlist', () => {
    const descriptor = emailPlugin({
      endpoint: 'https://api.example.com/send',
      provider: 'Zeabur',
    })

    expect(descriptor.id).toBe('kotoba-email')
    expect(descriptor.entrypoint).toBe('emdash-theme-kotoba-plugin-email/sandbox')
    expect(descriptor.capabilities).toEqual(['email:provide', 'email:intercept', 'network:fetch'])
    expect(descriptor.allowedHosts).toEqual(['api.example.com'])
    expect(descriptor.format).toBe('standard')
  })

  it('uses Zeabur endpoint by default', () => {
    const descriptor = emailPlugin({})
    expect(descriptor.options?.endpoint).toBe('https://api.zeabur.com/api/v1/zsend/emails')
    expect(descriptor.allowedHosts).toEqual(['api.zeabur.com'])
  })
})

describe('buildZeaburPayload', () => {
  it('normalizes recipient fields and maps optional fields', () => {
    const payload = buildZeaburPayload({
      from: '[email protected]',
      to: '[email protected]',
      cc: ['[email protected]'],
      bcc: '[email protected]',
      reply_to: '[email protected]',
      subject: 'Hello',
      text: 'Hello world',
      tags: { campaign: 'spring' },
    })

    expect(payload).toEqual({
      from: '[email protected]',
      to: ['[email protected]'],
      cc: ['[email protected]'],
      bcc: ['[email protected]'],
      reply_to: ['[email protected]'],
      subject: 'Hello',
      text: 'Hello world',
      tags: { campaign: 'spring' },
    })
  })

  it('throws when required fields are missing', () => {
    expect(() =>
      buildZeaburPayload({
        from: '[email protected]',
        to: '[email protected]',
        subject: 'Missing body',
      }),
    ).toThrow('Either text or html content is required')
  })
})

describe('Zeabur helpers', () => {
  it('builds details endpoint from deliver endpoint', () => {
    const detailsUrl = buildEmailDetailsUrl('https://api.zeabur.com/api/v1/zsend/emails', 'abc123')
    expect(detailsUrl).toBe('https://api.zeabur.com/api/v1/zsend/emails/abc123')
  })

  it('accepts pending/sent/delivered as success status', () => {
    expect(isDeliveryConfirmed('pending')).toBe(true)
    expect(isDeliveryConfirmed('sent')).toBe(true)
    expect(isDeliveryConfirmed('delivered')).toBe(true)
    expect(isDeliveryConfirmed('bounced')).toBe(false)
  })
})
