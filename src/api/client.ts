import type { ApiError } from '../types/catalog'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let authToken: string | null = null

export function setAuthToken(token: string | null): void {
  authToken = token
}

export function getApiUrl(): string {
  return API_URL
}

export class ApiRequestError extends Error {
  status: number
  code?: string

  constructor(status: number, detail: string, code?: string) {
    super(detail)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
  }
}

async function parseError(response: Response): Promise<ApiRequestError> {
  try {
    const body = (await response.json()) as ApiError
    return new ApiRequestError(response.status, body.detail, body.code)
  } catch {
    return new ApiRequestError(response.status, response.statusText)
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth && authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
