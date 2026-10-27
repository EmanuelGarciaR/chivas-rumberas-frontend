import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ChivaListItem } from '@/lib/types'
import { getChivas } from '@/lib/api/chivas'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChivaStatusSelect } from './_components/ChivaStatusSelect'

export const metadata: Metadata = {
  title: 'Flota | Admin',
}

export default async function AdminChivasPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')

  let chivas: ChivaListItem[] = []
  try {
    chivas = await getChivas(undefined, 0)
  } catch {
    // Show empty state on error
  }

  return (
    <div className="min-h-screen bg-primary px-6 py-8 text-txt-primary">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flota</h1>
          <p className="mt-1 text-sm text-txt-secondary">
            {chivas.length} chivas en total
          </p>
        </div>
        <Link
          href="/gestion-interna"
          className="text-sm text-txt-secondary transition-colors hover:text-rojo"
        >
          &larr; Dashboard
        </Link>
      </div>

      {chivas.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-txt-secondary">No hay chivas registradas.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chivas.map((chiva) => (
            <div
              key={chiva.id}
              className="rounded-xl border border-borde bg-card p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{chiva.name}</h3>
                {chiva.status === 'available' ? (
                  <Badge variant="success">Disponible</Badge>
                ) : chiva.status === 'maintenance' ? (
                  <Badge variant="warning">Mantenimiento</Badge>
                ) : (
                  <Badge variant="danger">Retirada</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-txt-secondary">
                {chiva.capacity} personas &mdash;{' '}
                {formatCurrency(chiva.pricePerHour)}
              </p>
              <ChivaStatusSelect chivaId={chiva.id} status={chiva.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
