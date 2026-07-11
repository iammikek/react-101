import { Link } from 'react-router-dom'
import type { Item } from '../types/catalog'

interface ItemTableProps {
  items: Item[]
}

export function ItemTable({ items }: ItemTableProps) {
  if (items.length === 0) {
    return <p className="empty">No items found.</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.category?.name ?? '—'}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
              <Link to={`/items/${item.id}`}>View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
