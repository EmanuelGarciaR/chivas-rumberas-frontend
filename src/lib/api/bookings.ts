import type {
  AvailabilityResponse,
  Booking,
  BookingsQueryParams,
  BookingTrackResponse,
  CalendarMonthResponse,
  CreateBookingDto,
  PaginatedBookingsResponse,
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
  return apiFetch<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getBookings(
  token: string,
  params: BookingsQueryParams = {},
): Promise<PaginatedBookingsResponse> {
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.limit !== undefined) search.set('limit', String(params.limit))
  if (params.status) search.set('status', params.status)
  if (params.q && params.q.trim()) search.set('q', params.q.trim())

  const query = search.toString()
  return apiFetch<PaginatedBookingsResponse>(
    `/bookings${query ? `?${query}` : ''}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      revalidate: 0,
    },
  )
}

export function getBooking(id: string, token: string): Promise<Booking> {
  return apiFetch<Booking>(`/bookings/${encodeURIComponent(id)}`, {
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
    `/bookings/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
      revalidate: 0,
    },
  )
}

export function trackBooking(
  code: string,
  email: string,
): Promise<BookingTrackResponse> {
  const search = new URLSearchParams({
    code: code.trim(),
    email: email.trim(),
  })
  return apiFetch<BookingTrackResponse>(`/bookings/track?${search.toString()}`, {
    revalidate: 0,
  })
}

export function getBookingsCalendar(
  month: string,
  token: string,
): Promise<CalendarMonthResponse> {
  return apiFetch<CalendarMonthResponse>(
    `/bookings/calendar?month=${encodeURIComponent(month)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      revalidate: 0,
    },
  )
}
