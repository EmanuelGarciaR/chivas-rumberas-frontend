import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getBookings, getBookingsCalendar } from '@/lib/api/bookings'
import { getChivas } from '@/lib/api/chivas'
import { ApiError } from '@/lib/api/client'
import { getTodayBogota } from '@/lib/utils'
import { AdminForbiddenState } from './_components/AdminForbiddenState'
import { BookingsCalendarSection } from './_components/BookingsCalendarSection'

const MONTH_PARAM_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/

interface AdminDashboardPageProps {
  searchParams: Promise<{ month?: string }>
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')

  const params = await searchParams
  const today = getTodayBogota()
  const month =
    params.month && MONTH_PARAM_REGEX.test(params.month)
      ? params.month
      : today.yearMonth

  const [totalRes, pendingRes, confirmedRes, chivasRes, calendarRes] =
    await Promise.allSettled([
      getBookings(token, { limit: 1 }),
      getBookings(token, { limit: 1, status: 'pending' }),
      getBookings(token, { limit: 1, status: 'confirmed' }),
      getChivas(undefined, 0),
      getBookingsCalendar(month, token),
    ])

  const isForbidden = [totalRes, pendingRes, confirmedRes, calendarRes].some(
    (res) =>
      res.status === 'rejected' &&
      res.reason instanceof ApiError &&
      res.reason.status === 403,
  )

  const bookingsError =
    !isForbidden && totalRes.status === 'rejected'
      ? totalRes.reason instanceof Error
        ? totalRes.reason.message
        : 'No fue posible cargar las reservas.'
      : null

  const totalBookings = totalRes.status === 'fulfilled' ? totalRes.value.meta.total : 0
  const pendientes = pendingRes.status === 'fulfilled' ? pendingRes.value.meta.total : 0
  const confirmadas = confirmedRes.status === 'fulfilled' ? confirmedRes.value.meta.total : 0
  const chivaList = chivasRes.status === 'fulfilled' ? chivasRes.value : []

  const calendarData =
    calendarRes.status === 'fulfilled' ? calendarRes.value : null
  const calendarError =
    !isForbidden && calendarRes.status === 'rejected'
      ? calendarRes.reason instanceof Error
        ? calendarRes.reason.message
        : 'No fue posible cargar el calendario.'
      : null

  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {isForbidden ? (
          <div className="mb-8">
            <AdminForbiddenState />
          </div>
        ) : (
          <>
            {bookingsError ? (
              <p className="mb-6 rounded-lg border border-rojo/30 bg-card p-4 text-sm text-rojo">
                Reservas: {bookingsError}
              </p>
            ) : null}
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <StatCard label="Total reservas" value={totalBookings} />
              <StatCard label="Pendientes" value={pendientes} highlight="warning" />
              <StatCard label="Confirmadas" value={confirmadas} highlight="success" />
            </div>
          </>
        )}

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminLink href="/gestion-interna/reservas" label="Gestionar reservas" />
          <AdminLink href="/gestion-interna/chivas" label={`Flota (${chivaList.length} chivas)`} />
        </div>

        {/* Confirmed Chivas Calendar */}
        {!isForbidden ? (
          <BookingsCalendarSection
            initialMonth={month}
            todayIso={today.isoDate}
            initialData={calendarData}
            initialError={calendarError}
            allChivas={chivaList}
          />
        ) : null}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: 'warning' | 'success'
}) {
  const valueColor =
    highlight === 'warning'
      ? 'text-rojo'
      : highlight === 'success'
        ? 'text-amarillo'
        : 'text-txt-primary'

  return (
    <div className="rounded-xl border border-borde bg-card p-5">
      <p className="text-sm text-txt-secondary">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-14 items-center justify-between rounded-xl border border-borde bg-card px-5 text-sm font-medium text-txt-primary transition-colors hover:border-amarillo hover:text-rojo"
    >
      {label}
      <span aria-hidden="true">&rarr;</span>
    </Link>
  )
}
