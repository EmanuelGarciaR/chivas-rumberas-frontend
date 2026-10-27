export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

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
  createdAt: string
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
