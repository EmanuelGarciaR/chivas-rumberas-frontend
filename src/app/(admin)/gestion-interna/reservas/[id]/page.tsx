import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import type { Booking } from '@/lib/types'
import { getBooking } from '@/lib/api/bookings'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { BookingStatusActions } from './_components/BookingStatusActions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Detalle reserva | Admin' }

const STATUS_LABEL: Record<Booking['status'], string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada',
}
const STATUS_VARIANT: Record<Booking['status'], 'warning' | 'success' | 'danger' | 'info'> = {
  pending: 'warning', confirmed: 'success', completed: 'info', cancelled: 'danger',
}

export default async function AdminReservaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = (await cookies()).get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')
  let booking: Booking
  try { booking = await getBooking(id, token) } catch { notFound() }

  return (
    <div className="min-h-screen bg-primary px-6 py-8 text-txt-primary">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/gestion-interna/reservas" className="text-sm text-txt-secondary hover:text-rojo">&larr; Reservas</Link>
          <Badge variant={STATUS_VARIANT[booking.status]}>{STATUS_LABEL[booking.status]}</Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-borde bg-card p-6">
            <h1 className="mb-4 text-lg font-bold">Datos de la reserva</h1>
            <dl className="space-y-3 text-sm">
              <Detail label="Cliente" value={booking.customerName} />
              <Detail label="Chiva" value={`${booking.chivaName} (${booking.chivaId})`} />
              <Detail label="Teléfono" value={booking.customerPhone} />
              <Detail label="Correo" value={booking.customerEmail} />
              <Detail label="Fecha" value={formatDate(booking.eventDate)} />
              <Detail label="Horario" value={`${booking.startTime} - ${booking.endTime}`} />
              <Detail label="Personas" value={String(booking.guestCount)} />
              <Detail label="Total" value={formatCurrency(booking.totalPrice)} />
              {booking.notes ? <Detail label="Notas" value={booking.notes} /> : null}
            </dl>
          </div>
          <div className="rounded-xl border border-borde bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">Cambiar estado</h2>
            <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-txt-secondary">{label}</dt><dd className="text-right font-medium">{value}</dd></div>
}
