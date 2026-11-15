import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { BookingStatus, PaginatedBookingsResponse } from '@/lib/types'
import { getBookings } from '@/lib/api/bookings'
import { ApiError } from '@/lib/api/client'
import { AdminForbiddenState } from '../_components/AdminForbiddenState'
import { ReservasTableClient } from './_components/ReservasTableClient'

export const metadata: Metadata = { title: 'Reservas | Admin' }

const VALID_STATUSES: ReadonlySet<string> = new Set([
  'pending',
  'confirmed',
  'completed',
  'cancelled',
])

interface AdminReservasPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    q?: string
  }>
}

export default async function AdminReservasPage({
  searchParams,
}: AdminReservasPageProps) {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')

  const params = await searchParams
  const rawPage = Number(params.page)
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1
  const status =
    params.status && VALID_STATUSES.has(params.status)
      ? (params.status as BookingStatus)
      : undefined
  const q = params.q?.trim() || undefined

  let response: PaginatedBookingsResponse = {
    data: [],
    meta: { page, limit: 10, total: 0, totalPages: 1 },
  }
  let isForbidden = false
  let error: string | null = null

  try {
    response = await getBookings(token, { page, limit: 10, status, q })
  } catch (reason: unknown) {
    if (reason instanceof ApiError && reason.status === 403) {
      isForbidden = true
    } else {
      error =
        reason instanceof Error
          ? reason.message
          : 'No fue posible cargar las reservas.'
    }
  }

  return (
    <div className="min-h-screen bg-primary px-6 py-8 text-txt-primary">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reservas</h1>
            {!isForbidden ? (
              <p className="mt-1 text-sm text-txt-secondary">
                {response.meta.total}{' '}
                {response.meta.total === 1 ? 'reserva en total' : 'reservas en total'}
              </p>
            ) : null}
          </div>
          <Link
            href="/gestion-interna"
            className="whitespace-nowrap text-sm text-txt-secondary transition-colors hover:text-rojo"
          >
            &larr; Dashboard
          </Link>
        </div>

        {isForbidden ? (
          <AdminForbiddenState />
        ) : (
          <ReservasTableClient
            bookings={response.data}
            meta={response.meta}
            initialStatus={status ?? ''}
            initialQuery={q ?? ''}
            error={error}
          />
        )}
      </div>
    </div>
  )
}
