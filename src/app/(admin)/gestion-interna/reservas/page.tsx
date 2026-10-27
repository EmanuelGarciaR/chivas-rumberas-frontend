import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Booking } from '@/lib/types'
import { getBookings } from '@/lib/api/bookings'
import { formatDate, formatCurrency, formatTime } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reservas | Admin' }

const STATUS_LABEL: Record<Booking['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const STATUS_VARIANT: Record<Booking['status'], 'warning' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'default',
  cancelled: 'danger',
}

export default async function AdminReservasPage() {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')

  let bookings: Booking[] = []
  let error: string | null = null
  try {
    bookings = await getBookings(token)
  } catch (reason: unknown) {
    error = reason instanceof Error ? reason.message : 'No fue posible cargar las reservas.'
  }

  return (
    <div className="min-h-screen bg-primary px-6 py-8 text-txt-primary">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reservas</h1>
            <p className="mt-1 text-sm text-txt-secondary">{bookings.length} reservas en total</p>
          </div>
          <Link href="/gestion-interna" className="text-sm text-txt-secondary hover:text-rojo">
            &larr; Dashboard
          </Link>
        </div>
        {error ? <p className="mb-4 rounded-lg bg-crema-claro p-4 text-sm text-rojo">{error}</p> : null}
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-borde bg-card p-10 text-center text-txt-secondary">
            No hay reservas registradas.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-borde">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-secondary">
                <tr className="text-left text-txt-secondary">
                  <th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Chiva</th><th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Horario</th><th className="px-4 py-3">Personas</th>
                  <th className="px-4 py-3">Total</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] bg-card">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-secondary">
                    <td className="px-4 py-3"><p className="font-medium">{booking.customerName}</p><p className="text-xs text-txt-secondary">{booking.customerPhone}</p></td>
                    <td className="px-4 py-3 text-txt-secondary">{booking.chivaName}<p className="text-xs">{booking.chivaId}</p></td>
                    <td className="px-4 py-3 text-txt-secondary">{formatDate(booking.eventDate)}</td>
                    <td className="px-4 py-3 text-txt-secondary">{formatTime(booking.startTime)} · {booking.durationHours} h</td>
                    <td className="px-4 py-3 text-txt-secondary">{booking.guestCount}</td>
                    <td className="px-4 py-3 text-txt-secondary">{formatCurrency(booking.totalPrice)}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[booking.status]}>{STATUS_LABEL[booking.status]}</Badge></td>
                    <td className="px-4 py-3"><Link href={`/gestion-interna/reservas/${booking.id}`} className="text-rojo hover:underline">Ver detalle</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
