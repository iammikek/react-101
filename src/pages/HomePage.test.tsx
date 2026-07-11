import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders intro links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Getting Fast at React' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse items' })).toHaveAttribute('href', '/items')
    expect(screen.getByRole('link', { name: 'Manage categories' })).toHaveAttribute(
      'href',
      '/categories',
    )
  })
})
