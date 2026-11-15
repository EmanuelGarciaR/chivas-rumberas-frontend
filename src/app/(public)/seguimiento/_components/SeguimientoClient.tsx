'use client'

import { ViewTransition, startTransition, useState } from 'react'
import type { BookingStatus, BookingTrackResponse } from '@/lib/types'
import { trackBooking } from '@/lib/api/bookings'
import { ApiError } from '@/lib/api/client'
import {
  cn,
  formatCurrency,
  formatDateLong,
  formatDateTimeBogota,
} from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface SeguimientoClientProps {
  initialCode: string
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

const TIMELINE_STEPS: { key: Exclude<BookingStatus, 'cancelled'>; label: string; hint: string }[] = [
  { key: 'pending', label: 'Pendiente', hint: 'Solicitud registrada' },
  { key: 'confirmed', label: 'Confirmada', hint: 'Reserva aprobada' },
  { key: 'completed', label: 'Completada', hint: 'Recorrido finalizado' },
]

function getStepIndex(status: BookingStatus): number {
  if (status === 'pending') return 0
  if (status === 'confirmed') return 1
  if (status === 'completed') return 2
  return -1
}

export function SeguimientoClient({ initialCode }: SeguimientoClientProps) {
  const [code, setCode] = useState(initialCode)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<BookingTrackResponse | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return

    const trimmedCode = code.trim().toUpperCase()
    const trimmedEmail = email.trim()

    if (!trimmedCode || !trimmedEmail) {
      setError('Ingresa el código de reserva y el correo electrónico.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await trackBooking(trimmedCode, trimmedEmail)
      startTransition(() => {
        setBooking(result)
      })
    } catch (reason: unknown) {
      let message = 'No fue posible consultar tu reserva en este momento.'
      if (reason instanceof ApiError) {
        if (reason.status === 429) {
          message =
            'Has realizado varias consultas seguidas. Por favor espera unos minutos antes de volver a intentar.'
        } else if (reason.status === 404) {
          message =
            reason.message ||
            'No se encontró ninguna reserva con los datos proporcionados.'
        } else if (reason.message) {
          message = reason.message
        }
      } else if (reason instanceof Error && reason.message) {
        message = reason.message
      }

      startTransition(() => {
        setBooking(null)
        setError(message)
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-borde bg-card p-6 sm:p-8">
        <h1 className="font-primary text-2xl font-bold text-txt-primary">
          Seguir mi reserva
        </h1>
        <p className="mt-2 text-sm text-txt-secondary">
          Consulta el estado actual de tu reserva ingresando el código de referencia y el correo con el que la solicitaste.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Código de reserva"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej. CR-SEED01"
              autoComplete="off"
              required
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-rojo/30 bg-secondary px-4 py-3 text-sm text-rojo"
            >
              {error}
            </p>
          ) : null}

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full whitespace-nowrap sm:w-auto"
            >
              {isLoading ? 'Consultando...' : 'Consultar reserva'}
            </Button>
          </div>
        </form>
      </div>

      {booking ? (
        <ViewTransition key={booking.code} enter="slide-up" exit="slide-down" default="none">
          <section
            aria-label="Resultado del seguimiento"
            className="mt-6 rounded-2xl border border-borde bg-card p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borde pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-txt-secondary">
                  Código de reserva
                </p>
                <p className="mt-0.5 font-mono text-xl font-bold text-txt-primary">
                  {booking.code}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[booking.status]}>
                {STATUS_LABEL[booking.status]}
              </Badge>
            </div>

            {/* Status Timeline */}
            <StatusTimeline status={booking.status} />

            {/* Summary */}
            <dl className="mt-6 grid gap-3 border-t border-borde pt-5 text-sm sm:grid-cols-2">
              <DetailItem label="Chiva" value={booking.chivaName} />
              <DetailItem label="Recorrido" value={booking.travelName} />
              <DetailItem label="Fecha del evento" value={formatDateLong(booking.eventDate)} />
              <DetailItem
                label="Horario"
                value={`${booking.startTime} - ${booking.endTime} (${booking.durationHours} h)`}
              />
              <DetailItem label="Invitados" value={`${booking.guestCount} personas`} />
              <DetailItem label="Total" value={formatCurrency(booking.totalPrice)} />
              <DetailItem
                label="Fecha de solicitud"
                value={formatDateTimeBogota(booking.createdAt)}
                className="sm:col-span-2"
              />
            </dl>
          </section>
        </ViewTransition>
      ) : null}
    </div>
  )
}

function StatusTimeline({ status }: { status: BookingStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="mt-6 rounded-xl border border-rojo/30 bg-secondary px-4 py-3 text-sm">
        <p className="font-semibold text-rojo">Reserva cancelada</p>
        <p className="mt-1 text-txt-secondary">
          Esta reserva fue cancelada. Si necesitas programar una nueva fecha, puedes hacer una nueva solicitud desde el inicio.
        </p>
      </div>
    )
  }

  const activeIndex = getStepIndex(status)
  const progressRatio = activeIndex <= 0 ? 0 : activeIndex / (TIMELINE_STEPS.length - 1)

  return (
    <div className="mt-6" aria-label="Progreso de la reserva">
      <div className="relative flex items-start justify-between gap-2">
        {/* Track background */}
        <div
          aria-hidden="true"
          className="absolute left-4 right-4 top-3.5 h-1 rounded-full bg-secondary"
        />
        {/* Filled progress line */}
        <div
          aria-hidden="true"
          className="motion-safe-progress absolute left-4 right-4 top-3.5 h-1 origin-left rounded-full bg-amarillo transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${progressRatio})` }}
        />

        {TIMELINE_STEPS.map((step, idx) => {
          const isReached = idx <= activeIndex
          const isCurrent = idx === activeIndex

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-1 flex-col items-center text-center"
            >
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  isReached
                    ? 'border-amarillo bg-amarillo text-negro'
                    : 'border-borde bg-card text-txt-secondary',
                )}
              >
                {idx + 1}
              </span>
              <span
                className={cn(
                  'mt-2 text-xs font-semibold sm:text-sm',
                  isReached ? 'text-txt-primary' : 'text-txt-secondary',
                )}
              >
                {step.label}
              </span>
              <span className="mt-0.5 hidden text-[11px] text-txt-secondary sm:block">
                {step.hint}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('rounded-lg bg-secondary/50 px-3.5 py-2.5', className)}>
      <dt className="text-xs text-txt-secondary">{label}</dt>
      <dd className="mt-0.5 font-medium text-txt-primary">{value}</dd>
    </div>
  )
}
