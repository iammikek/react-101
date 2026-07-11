import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="card">
      <h1>Getting Fast at React</h1>
      <p>
        A React SPA that consumes the <strong>fastAPI-101</strong> items/categories API — the
        client-side counterpart to django-101&apos;s server-rendered <code>/shop/</code>.
      </p>
      <ul className="links">
        <li>
          <Link to="/items">Browse items</Link>
        </li>
        <li>
          <Link to="/categories">Manage categories</Link>
        </li>
        <li>
          <Link to="/stats">View stats</Link>
        </li>
      </ul>
      <p className="hint">
        Start fastAPI-101 on <code>http://localhost:8000</code>, then register or log in to create
        items and categories.
      </p>
    </section>
  )
}
