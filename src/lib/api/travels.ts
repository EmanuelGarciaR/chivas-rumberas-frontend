import type { Travel } from '@/lib/types'
import { apiFetch } from './client'

export function getTravels(): Promise<Travel[]> {
  return apiFetch<Travel[]>('/travels', {
    tags: ['travels'],
    revalidate: 300,
  })
}
