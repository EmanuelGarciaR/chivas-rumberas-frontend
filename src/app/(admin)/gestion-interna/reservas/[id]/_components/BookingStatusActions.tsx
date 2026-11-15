'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingStatus, UpdateBookingStatusDto } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Props {
  bookingId: string
  currentStatus: BookingStatus
  currentTotalPrice: number
}

const transitions: Record<
  BookingStatus,
  { status: BookingStatus; label: string; variant: 'primary' | 'danger' | 'secondary' }[]
> = {
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

export function BookingStatusActions({
  bookingId,
  currentStatus,
  currentTotalPrice,
}: Props) {
  const router = useRouter()
  const [priceInput, setPriceInput] = useState(String(currentTotalPrice))
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  function parseValidPrice(): number | null {
    const parsed = Number(priceInput)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('El precio final acordado debe ser un número mayor a 0.')
      return null
    }
    return Math.round(parsed)
  }

  async function update(
    nextStatus: BookingStatus,
    includePrice: boolean,
    actionKey: string,
  ) {
    setError(null)
    setSuccessMsg(null)

    const payload: UpdateBookingStatusDto = { status: nextStatus }
    if (includePrice) {
      const validPrice = parseValidPrice()
      if (validPrice === null) return
      payload.totalPrice = validPrice
    }

    setLoading(actionKey)
    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(bookingId)}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        const message =
          typeof body?.error === 'string'
            ? body.error
            : body?.error?.message
        throw new Error(message ?? 'No fue posible actualizar la reserva.')
      }

      if (nextStatus === 'pending' && payload.totalPrice !== undefined) {
        setSuccessMsg(
          `Precio sugerido actualizado a ${formatCurrency(payload.totalPrice)} COP.`,
        )
      }
      router.refresh()
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'No fue posible actualizar la reserva.',
      )
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {currentStatus === 'pending' ? (
        <div className="mb-1 space-y-2 rounded-lg border border-borde bg-primary/50 p-3.5">
          <Input
            label="Precio final acordado (COP)"
            type="number"
            min={1}
            step={1000}
            value={priceInput}
            onChange={(e) => {
              setPriceInput(e.target.value)
              setError(null)
              setSuccessMsg(null)
            }}
            hint={`Precio sugerido actual: ${formatCurrency(currentTotalPrice)} COP`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isLoading={loading === 'save-price'}
            disabled={loading !== null}
            onClick={() => void update('pending', true, 'save-price')}
            className="w-full border border-borde whitespace-nowrap"
          >
            Guardar precio sin confirmar
          </Button>
        </div>
      ) : null}

      {transitions[currentStatus].map((action) => {
        const shouldSendPrice =
          currentStatus === 'pending' && action.status === 'confirmed'
        return (
          <Button
            key={action.status}
            variant={action.variant}
            isLoading={loading === action.status}
            disabled={loading !== null}
            onClick={() => void update(action.status, shouldSendPrice, action.status)}
          >
            {action.label}
          </Button>
        )
      })}

      {transitions[currentStatus].length === 0 ? (
        <p className="text-sm text-txt-secondary">
          Esta reserva está {currentStatus === 'completed' ? 'completada' : 'cancelada'}.
        </p>
      ) : null}

      {successMsg ? (
        <p
          role="status"
          className="rounded-lg bg-secondary px-3 py-2 text-sm text-txt-primary"
        >
          {successMsg}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-rojo/30 bg-secondary px-3 py-2 text-sm text-rojo"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
