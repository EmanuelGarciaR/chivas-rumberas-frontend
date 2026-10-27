'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingStatus } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  bookingId: string
  currentStatus: BookingStatus
}

const transitions: Record<BookingStatus, { status: BookingStatus; label: string; variant: 'primary' | 'danger' | 'secondary' }[]> = {
  pending: [
    { status: 'confirmed', label: 'Confirmar reserva', variant: 'primary' },
    { status: 'cancelled', label: 'Cancelar reserva', variant: 'danger' },
  ],
  confirmed: [
    { status: 'completed', label: 'Marcar como completada', variant: 'primary' },
    { status: 'cancelled', label: 'Cancelar reserva', variant: 'danger' },
  ],
  completed: [],
  cancelled: [],
}

export function BookingStatusActions({ bookingId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<BookingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function update(status: BookingStatus) {
    setLoading(status)
    setError(null)
    try {
      const response = await fetch(`/api/admin/bookings/${encodeURIComponent(bookingId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const message =
          typeof body?.error === 'string'
            ? body.error
            : body?.error?.message
        throw new Error(message ?? 'No fue posible actualizar la reserva.')
      }
      router.refresh()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'No fue posible actualizar la reserva.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {transitions[currentStatus].map((action) => (
        <Button key={action.status} variant={action.variant} isLoading={loading === action.status} onClick={() => update(action.status)}>
          {action.label}
        </Button>
      ))}
      {transitions[currentStatus].length === 0 ? (
        <p className="text-sm text-txt-secondary">
          Esta reserva está {currentStatus === 'completed' ? 'completada' : 'cancelada'}.
        </p>
      ) : null}
      {error ? <p className="rounded-lg bg-crema-claro px-3 py-2 text-sm text-rojo">{error}</p> : null}
    </div>
  )
}
