import { describe, expect, it, vi, beforeEach } from 'vitest'
import { apiRequest, setAuthToken } from './client'

describe('apiRequest auth', () => {
  beforeEach(() => {
    setAuthToken(null)
    vi.restoreAllMocks()
  })

  it('attaches bearer token when auth is requested', async () => {
    setAuthToken('test-token')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/items', { method: 'POST', body: JSON.stringify({}) }, true)

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect((options.headers as Headers).get('Authorization')).toBe('Bearer test-token')
  })
})
