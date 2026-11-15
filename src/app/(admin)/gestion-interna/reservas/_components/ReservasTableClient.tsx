'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import type {
  Booking,
  BookingStatus,
  CalendarSyncStatus,
  PaginationMeta,
} from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

interface ReservasTableClientProps {
  bookings: Booking[]
  meta: PaginationMeta
  initialStatus: BookingStatus | ''
  initialQuery: string
  error: string | null
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const STATUS_VARIANT: Record<BookingStatus, 'warning' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'default',
  cancelled: 'danger',
}

const SYNC_INDICATOR: Record<CalendarSyncStatus, { label: string; className: string }> = {
  synced: {
    label: 'Calendar sincronizado',
    className: 'text-txt-secondary',
  },
  pending: {
    label: 'Calendar pendiente',
    className: 'text-txt-secondary',
  },
  failed: {
    label: 'Calendar fallido',
    className: 'text-rojo font-medium',
  },
}

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
]

export function ReservasTableClient({
  bookings,
  meta,
  initialStatus,
  initialQuery,
  error,
}: ReservasTableClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const isFirstRender = useRef(true)

  function buildUrl(nextPage: number, nextStatus: string, nextQ: string): string {
    const params = new URLSearchParams()
    if (nextPage > 1) params.set('page', String(nextPage))
    if (nextStatus) params.set('status', nextStatus)
    if (nextQ.trim()) params.set('q', nextQ.trim())
    const qs = params.toString()
    return qs ? `/gestion-interna/reservas?${qs}` : '/gestion-interna/reservas'
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const trimmed = searchTerm.trim()
    if (trimmed === initialQuery.trim()) return

    const timer = window.setTimeout(() => {
      startTransition(() => {
        router.replace(buildUrl(1, initialStatus, trimmed))
      })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchTerm, initialStatus, initialQuery, router])

  function handleStatusChange(nextStatus: string) {
    startTransition(() => {
      router.replace(buildUrl(1, nextStatus, searchTerm))
    })
  }

  function handlePageChange(nextPage: number) {
    startTransition(() => {
      router.push(buildUrl(nextPage, initialStatus, searchTerm))
    })
  }

  function handleClearFilters() {
    setSearchTerm('')
    startTransition(() => {
      router.replace('/gestion-interna/reservas')
    })
  }

  const hasActiveFilters = Boolean(initialStatus || initialQuery.trim())

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-borde bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Buscar reserva"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Código CR-XXXXXX, nombre o correo"
            aria-label="Buscar reserva por código, nombre o correo"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            label="Estado"
            value={initialStatus}
            options={STATUS_FILTER_OPTIONS}
            onChange={(e) => handleStatusChange(e.target.value)}
          />
        </div>
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="whitespace-nowrap border border-borde"
          >
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rojo/30 bg-card p-4 text-sm text-rojo"
        >
          <span>{error}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => startTransition(() => router.refresh())}
            className="border border-borde whitespace-nowrap"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      {/* Table or Skeleton or Empty */}
      {isPending ? (
        <ReservasTableSkeleton />
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-borde bg-card p-10 text-center text-txt-secondary">
          <p className="font-medium text-txt-primary">
            {hasActiveFilters
              ? 'No encontramos reservas con esos filtros.'
              : 'No hay reservas registradas.'}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-3 text-sm font-medium text-rojo underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo"
            >
              Ver todas las reservas
            </button>
          ) : null}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-borde">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-secondary">
              <tr className="text-left text-txt-secondary">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Chiva</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Personas</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-card">
              {bookings.map((booking) => (
                <tr key={booking.id} className="transition-colors hover:bg-secondary/60">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-txt-primary whitespace-nowrap">
                    {booking.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-txt-primary">{booking.customerName}</p>
                    <p className="text-xs text-txt-secondary">{booking.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-txt-secondary">
                    <p className="font-medium text-txt-primary">{booking.chivaName}</p>
                    <p className="text-xs">{booking.chivaId}</p>
                  </td>
                  <td className="px-4 py-3 text-txt-secondary whitespace-nowrap">
                    {formatDate(booking.eventDate)}
                  </td>
                  <td className="px-4 py-3 text-txt-secondary whitespace-nowrap">
                    {booking.startTime} - {booking.endTime} · {booking.durationHours} h
                  </td>
                  <td className="px-4 py-3 text-txt-secondary">{booking.guestCount}</td>
                  <td className="px-4 py-3 text-txt-secondary whitespace-nowrap">
                    <p className="font-medium text-txt-primary">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    {booking.status === 'pending' ? (
                      <p className="text-[11px] text-txt-secondary">Precio sugerido</p>
                    ) : booking.status === 'confirmed' || booking.status === 'completed' ? (
                      <p className="text-[11px] text-txt-secondary">Precio confirmado</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant={STATUS_VARIANT[booking.status]}>
                        {STATUS_LABEL[booking.status]}
                      </Badge>
                      {booking.status === 'confirmed' ? (
                        <span
                          className={`text-[11px] ${
                            SYNC_INDICATOR[booking.calendarSyncStatus ?? 'pending'].className
                          }`}
                        >
                          {SYNC_INDICATOR[booking.calendarSyncStatus ?? 'pending'].label}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={`/gestion-interna/reservas/${booking.id}`}
                      className="font-medium text-rojo hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={handlePageChange}
        disabled={isPending}
      />
    </div>
  )
}

function ReservasTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-borde bg-card"
      aria-label="Cargando reservas"
      aria-busy="true"
    >
      <div className="border-b border-borde bg-secondary px-4 py-3">
        <Skeleton className="h-4 w-48 bg-borde/30" />
      </div>
      <div className="divide-y divide-[var(--border-color)]">
        {Array.from({ length: 6 }, (_, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-4 px-4 py-4">
            <Skeleton className="h-4 w-20 bg-secondary" />
            <Skeleton className="h-4 w-32 bg-secondary" />
            <Skeleton className="h-4 w-28 bg-secondary" />
            <Skeleton className="h-4 w-24 bg-secondary" />
            <Skeleton className="h-4 w-20 bg-secondary" />
            <Skeleton className="h-5 w-16 rounded-full bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  )
}
