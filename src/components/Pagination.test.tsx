import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders page metadata and navigates pages', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<Pagination total={25} skip={0} limit={10} onPageChange={onPageChange} />)

    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPageChange).toHaveBeenCalledWith(10)
  })

  it('hides when everything fits on one page', () => {
    const { container } = render(
      <Pagination total={5} skip={0} limit={10} onPageChange={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
