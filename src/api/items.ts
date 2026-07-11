import { apiRequest } from './client'
import type { Item, ItemCreateInput, ItemFilters, ItemStats, Paginated } from '../types/catalog'

function toQuery(filters: ItemFilters): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export async function listItems(filters: ItemFilters = {}): Promise<Paginated<Item>> {
  return apiRequest<Paginated<Item>>(`/items${toQuery(filters)}`)
}

export async function getItem(itemId: number): Promise<Item> {
  return apiRequest<Item>(`/items/${itemId}`)
}

export async function createItem(input: ItemCreateInput): Promise<Item> {
  return apiRequest<Item>('/items', { method: 'POST', body: JSON.stringify(input) }, true)
}

export async function updateItem(itemId: number, input: Partial<ItemCreateInput>): Promise<Item> {
  return apiRequest<Item>(
    `/items/${itemId}`,
    { method: 'PATCH', body: JSON.stringify(input) },
    true,
  )
}

export async function deleteItem(itemId: number): Promise<void> {
  return apiRequest<void>(`/items/${itemId}`, { method: 'DELETE' }, true)
}

export async function getItemStats(): Promise<ItemStats> {
  return apiRequest<ItemStats>('/items/stats/summary')
}
