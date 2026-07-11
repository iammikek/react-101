import type { Category, ItemFilters } from '../types/catalog'

interface ItemFiltersFormProps {
  categories: Category[]
  filters: ItemFilters
  onChange: (filters: ItemFilters) => void
}

export function ItemFiltersForm({ categories, filters, onChange }: ItemFiltersFormProps) {
  return (
    <form
      className="filters"
      onSubmit={(event) => {
        event.preventDefault()
        onChange({ ...filters, skip: 0 })
      }}
    >
      <label>
        Name contains
        <input
          type="text"
          value={filters.name_contains ?? ''}
          onChange={(event) =>
            onChange({ ...filters, name_contains: event.target.value || undefined })
          }
        />
      </label>
      <label>
        Category
        <select
          value={filters.category_id ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              category_id: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Min price
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.min_price ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              min_price: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </label>
      <label>
        Max price
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.max_price ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              max_price: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </label>
      <button type="submit">Apply filters</button>
    </form>
  )
}
