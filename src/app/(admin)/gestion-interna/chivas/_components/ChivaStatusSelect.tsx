'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ChivaStatus } from '@/lib/types'
import { Select } from '@/components/ui/Select'

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'maintenance', label: 'En mantenimiento' },
  { value: 'retired', label: 'Retirada' },
]

export function ChivaStatusSelect({
  chivaId,
  status,
}: {
  chivaId: string
  status: ChivaStatus
}) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(status)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(nextStatus: ChivaStatus) {
    if (nextStatus === selectedStatus) return

    const previousStatus = selectedStatus
    setSelectedStatus(nextStatus)
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/admin/chivas/${encodeURIComponent(chivaId)}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        },
      )

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const message =
          typeof body?.error === 'string'
            ? body.error
            : body?.error?.message
        throw new Error(message ?? 'No fue posible actualizar la chiva.')
      }

      router.refresh()
    } catch (reason: unknown) {
      setSelectedStatus(previousStatus)
      setError(
        reason instanceof Error
          ? reason.message
          : 'No fue posible actualizar la chiva.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mt-4">
      <Select
        label="Estado"
        value={selectedStatus}
        options={STATUS_OPTIONS}
        disabled={isSaving}
        onChange={(event) => {
          void handleChange(event.target.value as ChivaStatus)
        }}
        aria-describedby={error ? `${chivaId}-status-error` : undefined}
      />
      {isSaving ? (
        <p className="mt-1 text-xs text-txt-secondary">Guardando...</p>
      ) : null}
      {error ? (
        <p id={`${chivaId}-status-error`} className="mt-1 text-xs text-rojo">
          {error}
        </p>
      ) : null}
    </div>
  )
}
