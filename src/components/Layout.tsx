import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            Catalog Shop
          </Link>
          <nav className="nav">
            <Link to="/items">Items</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/stats">Stats</Link>
          </nav>
          <div className="auth">
            {user ? (
              <>
                <span className="user-email">{user.email}</span>
                <button type="button" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register" className="button-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
