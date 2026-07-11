import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ItemTable } from './ItemTable'
import type { Item } from '../types/catalog'

const sampleItems: Item[] = [
  {
    id: 1,
    name: 'Widget',
    description: null,
    price: 9.99,
    category_id: 2,
    category: { id: 2, name: 'Tools', description: null },
  },
]

describe('ItemTable', () => {
  it('renders items with category and price', () => {
    render(
      <MemoryRouter>
        <ItemTable items={sampleItems} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Widget')).toBeInTheDocument()
    expect(screen.getByText('Tools')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<ItemTable items={[]} />)
    expect(screen.getByText('No items found.')).toBeInTheDocument()
  })
})
