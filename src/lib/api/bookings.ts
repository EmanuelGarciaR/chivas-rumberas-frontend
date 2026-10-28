import type {
  AvailabilityResponse,
  Booking,
  CreateBookingDto,
  UpdateBookingStatusDto,
} from '@/lib/types'
import { apiFetch } from './client'

export function getAvailability(
  chivaId: string,
  date: string,
): Promise<AvailabilityResponse> {
  return apiFetch<AvailabilityResponse>(
    `/bookings/availability?chivaId=${encodeURIComponent(chivaId)}&date=${encodeURIComponent(date)}`,
    { revalidate: 0 },
  )
}

export function createBooking(data: CreateBookingDto): Promise<Booking> {
  return apiFetch<Booking>('bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getBookings(token: string): Promise<Booking[]> {
  return apiFetch<Booking[]>('bookings', {
    headers: { Authorization: `Bearer ${token}` },
    revalidate: 0,
  })
}

export function getBooking(id: string, token: string): Promise<Booking> {
  return apiFetch<Booking>(`bookings/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    revalidate: 0,
  })
}

export function updateBookingStatus(
  id: string,
  data: UpdateBookingStatusDto,
  token: string,
): Promise<Booking> {
  return apiFetch<Booking>(
    `bookings/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
      revalidate: 0,
    },
  )
}
