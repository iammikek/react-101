import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../api/auth'
import { setAuthToken } from '../api/client'
import type { User } from '../types/catalog'

const TOKEN_KEY = 'react-101-token'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
    setUser(null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const token = await loginUser(email, password)
    localStorage.setItem(TOKEN_KEY, token.access_token)
    setAuthToken(token.access_token)
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
  }, [])

  const register = useCallback(
    async (email: string, password: string) => {
      await registerUser(email, password)
      await login(email, password)
    },
    [login],
  )

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    setAuthToken(token)
    fetchCurrentUser()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [logout])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
