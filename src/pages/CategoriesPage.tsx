import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, listCategories } from '../api/categories'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import type { Category } from '../types/catalog'

const PAGE_SIZE = 10

export function CategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadCategories(nextSkip = skip) {
    setLoading(true)
    setError(null)
    try {
      const response = await listCategories(nextSkip, PAGE_SIZE)
      setCategories(response.items)
      setTotal(response.total)
      setSkip(response.skip)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!user) {
      return
    }
    setError(null)
    try {
      await createCategory({ name, description: description || null })
      setName('')
      setDescription('')
      await loadCategories(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    }
  }

  async function handleDelete(category: Category) {
    if (!user) {
      return
    }
    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return
    }
    try {
      await deleteCategory(category.id)
      await loadCategories(skip)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <section className="card">
      <h1>Categories</h1>

      {user ? (
        <form onSubmit={handleCreate} className="stack inline-form">
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Description
            <input value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <button type="submit">Add category</button>
        </form>
      ) : (
        <p className="hint">Log in to create or delete categories.</p>
      )}

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && categories.length === 0 && <p className="empty">No categories yet.</p>}

      {categories.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              {user && <th></th>}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description ?? '—'}</td>
                {user && (
                  <td>
                    <button type="button" className="danger" onClick={() => handleDelete(category)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination
        total={total}
        skip={skip}
        limit={PAGE_SIZE}
        onPageChange={(nextSkip) => loadCategories(nextSkip)}
      />
    </section>
  )
}
