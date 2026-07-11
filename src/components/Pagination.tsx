interface PaginationProps {
  total: number
  skip: number
  limit: number
  onPageChange: (skip: number) => void
}

export function Pagination({ total, skip, limit, onPageChange }: PaginationProps) {
  if (total <= limit) {
    return null
  }

  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={skip === 0}
        onClick={() => onPageChange(Math.max(0, skip - limit))}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages} ({total} total)
      </span>
      <button
        type="button"
        disabled={skip + limit >= total}
        onClick={() => onPageChange(skip + limit)}
      >
        Next
      </button>
    </div>
  )
}
