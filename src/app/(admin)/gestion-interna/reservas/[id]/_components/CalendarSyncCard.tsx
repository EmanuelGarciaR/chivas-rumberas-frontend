'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Booking, CalendarSyncStatus } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface CalendarSyncCardProps {
  bookingId: string
  initialSyncStatus?: CalendarSyncStatus
}

const SYNC_LABEL: Record<CalendarSyncStatus, string> = {
  synced: 'Sincronizada',
  pending: 'Pendiente',
  failed: 'Fallida',
}

const SYNC_VARIANT: Record<CalendarSyncStatus, 'success' | 'warning' | 'danger'> = {
  synced: 'success',
  pending: 'warning',
  failed: 'danger',
}

export function CalendarSyncCard({
  bookingId,
  initialSyncStatus = 'pending',
}: CalendarSyncCardProps) {
  const router = useRouter()
  const [syncStatus, setSyncStatus] = useState<CalendarSyncStatus>(initialSyncStatus)
  const [isSyncing, setIsSyncing] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null,
  )

  async function handleRetrySync() {
    setIsSyncing(true)
    setFeedback(null)

    try {
      const res = await fetch(
        `/api/admin/bookings/${encodeURIComponent(bookingId)}/calendar-sync`,
        { method: 'POST' },
      )
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(
          body?.error?.message ?? 'No fue posible sincronizar con Google Calendar.',
        )
      }

      const updated = body as Booking
      const nextStatus = updated.calendarSyncStatus ?? 'pending'
      setSyncStatus(nextStatus)
      setFeedback(
        nextStatus === 'synced'
          ? { type: 'ok', text: 'Reserva sincronizada en Google Calendar.' }
          : {
              type: 'error',
              text: 'La sincronización volvió a fallar. Intenta de nuevo en unos momentos.',
            },
      )
      router.refresh()
    } catch (reason: unknown) {
      setFeedback({
        type: 'error',
        text:
          reason instanceof Error
            ? reason.message
            : 'No fue posible sincronizar con Google Calendar.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="rounded-xl border border-borde bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Google Calendar</h2>
          <p className="mt-1 text-sm text-txt-secondary">
            Estado de sincronización de esta reserva confirmada.
          </p>
        </div>
        <Badge variant={SYNC_VARIANT[syncStatus]}>{SYNC_LABEL[syncStatus]}</Badge>
      </div>

      {syncStatus === 'failed' ? (
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSyncing}
            disabled={isSyncing}
            onClick={() => void handleRetrySync()}
            className="whitespace-nowrap"
          >
            {isSyncing ? 'Sincronizando...' : 'Reintentar sincronización'}
          </Button>
        </div>
      ) : null}

      {feedback ? (
        <p
          role="status"
          className={
            feedback.type === 'ok'
              ? 'mt-3 rounded-lg bg-secondary px-3 py-2 text-sm text-txt-primary'
              : 'mt-3 rounded-lg border border-rojo/30 bg-secondary px-3 py-2 text-sm text-rojo'
          }
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  )
}
