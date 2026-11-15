'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { ChivaListItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ChivaStatusSelect } from './ChivaStatusSelect'
import { ChivaFormModal } from './ChivaFormModal'
import { RetireChivaModal } from './RetireChivaModal'

interface ChivasAdminClientProps {
  chivas: ChivaListItem[]
  error: string | null
}

export function ChivasAdminClient({ chivas, error }: ChivasAdminClientProps) {
  const [formState, setFormState] = useState<
    { open: false } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; chiva: ChivaListItem }
  >({ open: false })

  const [retireTarget, setRetireTarget] = useState<ChivaListItem | null>(null)

  return (
    <div className="min-h-screen bg-primary px-6 py-8 text-txt-primary">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Flota</h1>
            <p className="mt-1 text-sm text-txt-secondary">
              {chivas.length} {chivas.length === 1 ? 'chiva en total' : 'chivas en total'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setFormState({ open: true, mode: 'create' })}
              className="whitespace-nowrap"
            >
              Nueva chiva
            </Button>
            <Link
              href="/gestion-interna"
              className="whitespace-nowrap text-sm text-txt-secondary transition-colors hover:text-rojo"
            >
              &larr; Dashboard
            </Link>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-rojo/30 bg-card p-4 text-sm text-rojo"
          >
            {error}
          </p>
        ) : null}

        {chivas.length === 0 ? (
          <div className="rounded-xl border border-borde bg-card p-10 text-center">
            <p className="text-txt-secondary">No hay chivas registradas.</p>
            <div className="mt-4">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setFormState({ open: true, mode: 'create' })}
              >
                Crear primera chiva
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chivas.map((chiva) => {
              const cover = chiva.imageUrls?.[0]
              const features = chiva.features ?? []

              return (
                <article
                  key={chiva.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-borde bg-card"
                >
                  {cover ? (
                    <div className="relative aspect-[16/9] w-full bg-secondary">
                      <Image
                        src={cover}
                        alt={chiva.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary text-xs text-txt-secondary">
                      Sin imagen principal
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-txt-primary">{chiva.name}</h2>
                      {chiva.status === 'available' ? (
                        <Badge variant="success">Disponible</Badge>
                      ) : chiva.status === 'maintenance' ? (
                        <Badge variant="warning">Mantenimiento</Badge>
                      ) : (
                        <Badge variant="danger">Retirada</Badge>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-txt-secondary">
                      {chiva.capacity} personas · {formatCurrency(chiva.pricePerHour)} / hora
                    </p>

                    {features.length > 0 ? (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {features.slice(0, 3).map((feat) => (
                          <li
                            key={feat}
                            className="rounded-full border border-borde bg-secondary px-2.5 py-0.5 text-xs text-txt-secondary"
                          >
                            {feat}
                          </li>
                        ))}
                        {features.length > 3 ? (
                          <li className="rounded-full border border-borde bg-secondary px-2.5 py-0.5 text-xs text-txt-secondary">
                            +{features.length - 3}
                          </li>
                        ) : null}
                      </ul>
                    ) : null}

                    <div className="mt-auto pt-2">
                      <ChivaStatusSelect
                        key={`${chiva.id}-${chiva.status}`}
                        chivaId={chiva.id}
                        status={chiva.status}
                      />

                      <div className="mt-4 flex items-center gap-2 border-t border-borde pt-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormState({ open: true, mode: 'edit', chiva })
                          }
                          className="flex-1 border border-borde whitespace-nowrap"
                        >
                          Editar
                        </Button>
                        {chiva.status !== 'retired' ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setRetireTarget(chiva)}
                            className="border border-rojo/40 text-rojo hover:bg-rojo/10 whitespace-nowrap"
                          >
                            Retirar
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {formState.open ? (
        <ChivaFormModal
          mode={formState.mode}
          chiva={formState.mode === 'edit' ? formState.chiva : undefined}
          onClose={() => setFormState({ open: false })}
        />
      ) : null}

      {retireTarget ? (
        <RetireChivaModal
          chiva={retireTarget}
          onClose={() => setRetireTarget(null)}
        />
      ) : null}
    </div>
  )
}
