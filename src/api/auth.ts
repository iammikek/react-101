import { apiRequest } from './client'
import type { TokenResponse, User } from '../types/catalog'

export async function registerUser(email: string, password: string): Promise<User> {
  return apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams()
  body.set('username', email)
  body.set('password', password)

  return apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
}

export async function fetchCurrentUser(): Promise<User> {
  return apiRequest<User>('/auth/me', {}, true)
}
