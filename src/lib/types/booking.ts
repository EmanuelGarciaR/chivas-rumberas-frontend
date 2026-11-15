export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type CalendarSyncStatus = 'pending' | 'synced' | 'failed'

export interface CreateBookingDto {
  chivaId: string
  travelId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  guestCount: number
  eventDate: string      // YYYY-MM-DD
  startTime: string      // HH:mm
  durationHours: number
  notes?: string
}

export interface Booking {
  id: string             // e.g. CR-7X8M2P
  chivaId: string
  chivaName: string
  travelId: string
  travelName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  guestCount: number
  eventDate: string
  startTime: string
  endTime: string
  durationHours: number
  totalPrice: number
  status: BookingStatus
  notes?: string
  calendarSyncStatus?: CalendarSyncStatus
  createdAt: string
}

export interface BookingsQueryParams {
  page?: number
  limit?: number
  status?: BookingStatus
  q?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedBookingsResponse {
  data: Booking[]
  meta: PaginationMeta
}

export interface BookingTrackResponse {
  id: string
  code: string
  status: BookingStatus
  createdAt: string
  chivaId: string
  chivaName: string
  travelId: string
  travelName: string
  eventDate: string
  startTime: string
  endTime: string
  durationHours: number
  guestCount: number
  totalPrice: number
}

export interface CalendarSlot {
  bookingId: string
  startTime: string
  endTime: string
  durationHours: number
  customerName: string
  travelName: string
  guestCount: number
  endsNextDay?: boolean
}

export interface CalendarChivaDay {
  chivaId: string
  chivaName: string
  slots: CalendarSlot[]
}

export interface CalendarDay {
  date: string
  chivasCount: number
  chivas: CalendarChivaDay[]
}

export interface CalendarMonthResponse {
  month: string
  chivas: { id: string; name: string }[]
  days: CalendarDay[]
}

export interface OccupiedSlot {
  startTime: string
  endTime: string
  durationHours: number
}

export interface AvailabilityResponse {
  chivaId: string
  date: string
  occupiedSlots: OccupiedSlot[]
  isFullyBooked: boolean
}

export interface UpdateBookingStatusDto {
  status: BookingStatus
}
