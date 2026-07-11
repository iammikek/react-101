import { useEffect, useState } from 'react'
import { getItemStats } from '../api/items'
import type { ItemStats } from '../types/catalog'

export function StatsPage() {
  const [stats, setStats] = useState<ItemStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getItemStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p>Loading…</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (!stats) {
    return null
  }

  return (
    <section className="card">
      <h1>Item stats</h1>
      <dl className="stats-grid">
        <div>
          <dt>Total items</dt>
          <dd>{stats.total_items}</dd>
        </div>
        <div>
          <dt>Average price</dt>
          <dd>${stats.average_price.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Min price</dt>
          <dd>{stats.min_price !== null ? `$${stats.min_price.toFixed(2)}` : '—'}</dd>
        </div>
        <div>
          <dt>Max price</dt>
          <dd>{stats.max_price !== null ? `$${stats.max_price.toFixed(2)}` : '—'}</dd>
        </div>
        <div>
          <dt>Uncategorized</dt>
          <dd>{stats.uncategorized_count}</dd>
        </div>
      </dl>

      {stats.by_category.length > 0 && (
        <>
          <h2>By category</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Items</th>
                <th>Avg price</th>
              </tr>
            </thead>
            <tbody>
              {stats.by_category.map((row) => (
                <tr key={row.category_id}>
                  <td>{row.category_name}</td>
                  <td>{row.item_count}</td>
                  <td>${row.average_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}
