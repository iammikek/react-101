import { describe, expect, it, vi, beforeEach } from 'vitest'
import { listItems } from './items'

describe('listItems', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('builds query string from filters', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [], total: 0, skip: 0, limit: 10 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await listItems({ skip: 0, limit: 10, category_id: 2, min_price: 5 })

    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toContain('category_id=2')
    expect(url).toContain('min_price=5')
  })
})
