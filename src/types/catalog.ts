export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Item {
  id: number
  name: string
  description: string | null
  price: number
  category_id: number | null
  category: Category | null
}

export interface Paginated<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface ItemStats {
  total_items: number
  average_price: number
  min_price: number | null
  max_price: number | null
  uncategorized_count: number
  by_category: Array<{
    category_id: number
    category_name: string
    item_count: number
    average_price: number
  }>
}

export interface User {
  id: number
  email: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface ApiError {
  detail: string
  code?: string
}

export interface ItemFilters {
  skip?: number
  limit?: number
  min_price?: number
  max_price?: number
  category_id?: number
  name_contains?: string
}

export interface ItemCreateInput {
  name: string
  description?: string | null
  price: number
  category_id?: number | null
}

export interface CategoryCreateInput {
  name: string
  description?: string | null
}
