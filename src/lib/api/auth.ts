import type { AuthResponse, LoginDto } from '@/lib/types'
import { apiFetch } from './client'

export function login(data: LoginDto): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
