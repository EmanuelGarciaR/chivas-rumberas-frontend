import type { Chiva, ChivaListItem, ChivaStatus } from '@/lib/types'
import { apiFetch } from './client'

export function getChivas(
  status?: ChivaStatus,
  revalidate: number | false = 60,
): Promise<ChivaListItem[]> {
  const query = status ? `?status=${status}` : ''
  return apiFetch<ChivaListItem[]>(`/chivas${query}`, {
    tags: ['chivas'],
    revalidate,
  })
}

export function updateChivaStatus(
  id: string,
  status: ChivaStatus,
  token: string,
): Promise<Chiva> {
  return apiFetch<Chiva>(`/chivas/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
    revalidate: 0,
  })
}

export function getChiva(id: string): Promise<Chiva> {
  return apiFetch<Chiva>(`/chivas/${id}`, {
    tags: [`chiva-${id}`],
    revalidate: 60,
  })
}
