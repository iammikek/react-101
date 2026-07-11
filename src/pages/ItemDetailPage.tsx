import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { listCategories } from '../api/categories'
import { createItem, deleteItem, getItem, updateItem } from '../api/items'
import { useAuth } from '../context/AuthContext'
import type { Category, Item } from '../types/catalog'

export function ItemDetailPage() {
  const { itemId } = useParams()
  const isNew = itemId === 'new'
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    listCategories()
      .then((response) => setCategories(response.items))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (isNew) {
      return
    }

    const id = Number(itemId)
    if (Number.isNaN(id)) {
      setError('Invalid item id')
      setLoading(false)
      return
    }

    getItem(id)
      .then((loaded) => {
        setItem(loaded)
        setName(loaded.name)
        setDescription(loaded.description ?? '')
        setPrice(String(loaded.price))
        setCategoryId(loaded.category_id ? String(loaded.category_id) : '')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Item not found'))
      .finally(() => setLoading(false))
  }, [isNew, itemId])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!user) {
      setError('Log in to save items')
      return
    }

    const payload = {
      name,
      description: description || null,
      price: Number(price),
      category_id: categoryId ? Number(categoryId) : null,
    }

    setError(null)
    try {
      if (isNew) {
        const created = await createItem(payload)
        navigate(`/items/${created.id}`)
      } else if (item) {
        const updated = await updateItem(item.id, payload)
        setItem(updated)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function handleDelete() {
    if (!item || !user) {
      return
    }
    if (!window.confirm(`Delete "${item.name}"?`)) {
      return
    }
    try {
      await deleteItem(item.id)
      navigate('/items')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  if (loading) {
    return <p>Loading…</p>
  }

  return (
    <section className="card narrow">
      <h1>{isNew ? 'Add item' : (item?.name ?? 'Item')}</h1>
      {!user && <p className="hint">Log in to create or edit items.</p>}

      <form onSubmit={handleSubmit} className="stack">
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        {user && (
          <div className="actions">
            <button type="submit">{isNew ? 'Create item' : 'Save changes'}</button>
            {!isNew && (
              <button type="button" className="danger" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </form>

      <p>
        <Link to="/items">Back to items</Link>
      </p>
    </section>
  )
}
