'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ChivaListItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface RetireChivaModalProps {
  chiva: ChivaListItem
  onClose: () => void
}

export function RetireChivaModal({ chiva, onClose }: RetireChivaModalProps) {
  const router = useRouter()
  const [isRetiring, setIsRetiring] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRetiring) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isRetiring, onClose])

  async function handleConfirm() {
    setIsRetiring(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/chivas/${encodeURIComponent(chiva.id)}`, {
        method: 'DELETE',
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        const msg =
          body?.error?.message ?? 'No fue posible retirar la chiva.'
        throw new Error(msg)
      }
      router.refresh()
      onClose()
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'No fue posible retirar la chiva.',
      )
    } finally {
      setIsRetiring(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="retire-chiva-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-borde bg-card p-6 text-txt-primary shadow-xl">
        <h2 id="retire-chiva-title" className="text-lg font-bold">
          Retirar chiva
        </h2>
        <p className="mt-2 text-sm text-txt-secondary">
          ¿Seguro que deseas retirar <strong className="text-txt-primary">{chiva.name}</strong>?
          Pasará a estado retirada y dejará de mostrarse como disponible para nuevas reservas.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-rojo/40 bg-secondary px-3 py-2.5 text-sm text-rojo"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isRetiring}
            onClick={onClose}
            className="border border-borde whitespace-nowrap"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isRetiring}
            onClick={() => void handleConfirm()}
            className="whitespace-nowrap"
          >
            Confirmar retiro
          </Button>
        </div>
      </div>
    </div>
  )
}
