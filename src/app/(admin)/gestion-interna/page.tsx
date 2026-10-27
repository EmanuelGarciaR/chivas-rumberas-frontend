import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getBookings } from '@/lib/api/bookings'
import { getChivas } from '@/lib/api/chivas'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')

  const [bookings, chivas] = await Promise.allSettled([
    getBookings(token),
    getChivas(),
  ])

  const bookingList = bookings.status === 'fulfilled' ? bookings.value : []
  const chivaList = chivas.status === 'fulfilled' ? chivas.value : []
  const bookingsError =
    bookings.status === 'rejected'
      ? bookings.reason instanceof Error
        ? bookings.reason.message
        : 'No fue posible cargar las reservas.'
      : null

  const pendientes = bookingList.filter((b) => b.status === 'pending').length
  const confirmadas = bookingList.filter((b) => b.status === 'confirmed').length

  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <div className="flex-1 px-6 py-8">
        {bookingsError ? (
          <p className="mb-6 rounded-lg bg-crema-claro p-4 text-sm text-rojo">
            Reservas: {bookingsError}
          </p>
        ) : null}
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total reservas" value={bookingList.length} />
          <StatCard label="Pendientes" value={pendientes} highlight="warning" />
          <StatCard label="Confirmadas" value={confirmadas} highlight="success" />
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminLink href="/gestion-interna/reservas" label="Gestionar reservas" />
          <AdminLink href="/gestion-interna/chivas" label={`Flota (${chivaList.length} chivas)`} />
        </div>
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
