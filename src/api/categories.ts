import { apiRequest } from './client'
import type { Category, CategoryCreateInput, Paginated } from '../types/catalog'

export async function listCategories(skip = 0, limit = 100): Promise<Paginated<Category>> {
  return apiRequest<Paginated<Category>>(`/categories?skip=${skip}&limit=${limit}`)
}

export async function createCategory(input: CategoryCreateInput): Promise<Category> {
  return apiRequest<Category>('/categories', { method: 'POST', body: JSON.stringify(input) }, true)
}

export async function deleteCategory(categoryId: number): Promise<void> {
  return apiRequest<void>(`/categories/${categoryId}`, { method: 'DELETE' }, true)
}
