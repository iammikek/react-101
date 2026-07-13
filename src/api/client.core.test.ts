import { describe, expect, it, vi, beforeEach } from 'vitest'
import { apiRequest, setAuthToken } from './client'

describe('apiRequest core', () => {
  beforeEach(() => {
    setAuthToken(null)
    vi.restoreAllMocks()
  })

  it('returns JSON for successful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ hello: 'world' }),
      }),
    )

    const result = await apiRequest<{ hello: string }>('/health')
    expect(result.hello).toBe('world')
  })

  it('throws ApiRequestError with API detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ detail: 'Category name exists', code: 'CATEGORY_NAME_EXISTS' }),
      }),
    )

    await expect(apiRequest('/categories')).rejects.toMatchObject({
      status: 409,
      message: 'Category name exists',
      code: 'CATEGORY_NAME_EXISTS',
    })
  })
})
