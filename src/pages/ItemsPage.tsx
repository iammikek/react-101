import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCategories } from '../api/categories'
import { listItems } from '../api/items'
import { ItemFiltersForm } from '../components/ItemFiltersForm'
import { ItemTable } from '../components/ItemTable'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import type { Category, Item, ItemFilters } from '../types/catalog'

const PAGE_SIZE = 10

export function ItemsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<ItemFilters>({ skip: 0, limit: PAGE_SIZE })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listCategories()
      .then((response) => setCategories(response.items))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    listItems(filters)
      .then((response) => {
        setItems(response.items)
        setTotal(response.total)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load items'))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <section className="card">
      <div className="page-header">
        <h1>Items</h1>
        {user && (
          <Link to="/items/new" className="button-link">
            Add item
          </Link>
        )}
      </div>

      <ItemFiltersForm
        categories={categories}
        filters={filters}
        onChange={(next) => setFilters({ ...next, skip: 0, limit: PAGE_SIZE })}
      />

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <ItemTable items={items} />}

      <Pagination
        total={total}
        skip={filters.skip ?? 0}
        limit={filters.limit ?? PAGE_SIZE}
        onPageChange={(skip) => setFilters({ ...filters, skip })}
      />
    </section>
  )
}
