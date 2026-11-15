'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ChivaListItem, ChivaStatus, CreateChivaDto, UpdateChivaDto } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { CloudinaryImageUploader } from './CloudinaryImageUploader'

interface ChivaFormModalProps {
  mode: 'create' | 'edit'
  chiva?: ChivaListItem
  onClose: () => void
}

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'maintenance', label: 'En mantenimiento' },
  { value: 'retired', label: 'Retirada' },
]

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, idx) => val === b[idx])
}

export function ChivaFormModal({ mode, chiva, onClose }: ChivaFormModalProps) {
  const router = useRouter()

  const [name, setName] = useState(chiva?.name ?? '')
  const [description, setDescription] = useState(chiva?.description ?? '')
  const [capacity, setCapacity] = useState(chiva ? String(chiva.capacity) : '40')
  const [pricePerHour, setPricePerHour] = useState(
    chiva ? String(chiva.pricePerHour) : '250000',
  )
  const [status, setStatus] = useState<ChivaStatus>(chiva?.status ?? 'available')
  const [features, setFeatures] = useState<string[]>(chiva?.features ?? [])
  const [featureInput, setFeatureInput] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>(chiva?.imageUrls ?? [])

  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving && !isUploadingImages) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isSaving, isUploadingImages, onClose])

  function handleAddFeature() {
    const trimmed = featureInput.trim()
    if (!trimmed) return
    if (!features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed])
    }
    setFeatureInput('')
  }

  function handleRemoveFeature(item: string) {
    setFeatures((prev) => prev.filter((f) => f !== item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isUploadingImages || isSaving) return

    const trimmedName = name.trim()
    const trimmedDesc = description.trim()
    const parsedCapacity = Number(capacity)
    const parsedPrice = Number(pricePerHour)

    if (!trimmedName) {
      setError('El nombre de la chiva es obligatorio.')
      return
    }
    if (!trimmedDesc) {
      setError('La descripción es obligatoria.')
      return
    }
    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      setError('La capacidad debe ser un número entero mayor a 0.')
      return
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
      setError('El precio por hora debe ser mayor a 0.')
      return
    }

    setError(null)
    setIsSaving(true)

    try {
      if (mode === 'create') {
        const payload: CreateChivaDto = {
          name: trimmedName,
          description: trimmedDesc,
          capacity: parsedCapacity,
          pricePerHour: Math.round(parsedPrice),
          features,
          status,
          imageUrls,
        }

        const res = await fetch('/api/admin/chivas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const body = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error(body?.error?.message ?? 'No fue posible crear la chiva.')
        }
      } else if (chiva) {
        const patch: UpdateChivaDto = {}
        if (trimmedName !== chiva.name) patch.name = trimmedName
        if (trimmedDesc !== (chiva.description ?? '')) patch.description = trimmedDesc
        if (parsedCapacity !== chiva.capacity) patch.capacity = parsedCapacity
        if (Math.round(parsedPrice) !== chiva.pricePerHour) {
          patch.pricePerHour = Math.round(parsedPrice)
        }
        if (status !== chiva.status) patch.status = status
        if (!arraysEqual(features, chiva.features ?? [])) patch.features = features
        if (!arraysEqual(imageUrls, chiva.imageUrls ?? [])) patch.imageUrls = imageUrls

        if (Object.keys(patch).length === 0) {
          onClose()
          return
        }

        const res = await fetch(`/api/admin/chivas/${encodeURIComponent(chiva.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        const body = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error(body?.error?.message ?? 'No fue posible actualizar la chiva.')
        }
      }

      router.refresh()
      onClose()
    } catch (reason: unknown) {
      setError(
        reason instanceof Error ? reason.message : 'Ocurrió un error al guardar.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chiva-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-borde bg-card p-6 text-txt-primary shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-borde pb-4">
          <h2 id="chiva-modal-title" className="text-xl font-bold">
            {mode === 'create' ? 'Nueva chiva' : `Editar: ${chiva?.name}`}
          </h2>
          <button
            type="button"
            disabled={isSaving || isUploadingImages}
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg px-2.5 py-1 text-sm text-txt-secondary hover:bg-secondary hover:text-txt-primary disabled:opacity-40"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. La Sabrosura"
              required
            />
            <Select
              label="Estado"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(e) => setStatus(e.target.value as ChivaStatus)}
            />
          </div>

          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el sonido, iluminación y ambiente de la chiva"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Capacidad (personas)"
              type="number"
              min={1}
              step={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
            <Input
              label="Precio por hora (COP)"
              type="number"
              min={1000}
              step={1000}
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              required
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label
              htmlFor="chiva-feature-input"
              className="block text-sm font-medium text-txt-primary"
            >
              Características
            </label>
            <div className="flex gap-2">
              <input
                id="chiva-feature-input"
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFeature()
                  }
                }}
                placeholder="Ej. Sonido 4000W, Luces LED..."
                className="h-10 flex-1 rounded-lg border border-borde bg-card px-3 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-amarillo"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddFeature}
                className="border border-borde whitespace-nowrap"
              >
                Agregar
              </Button>
            </div>
            {features.length > 0 ? (
              <ul className="flex flex-wrap gap-2 pt-1">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="inline-flex items-center gap-1.5 rounded-full border border-borde bg-secondary px-3 py-1 text-xs font-medium text-txt-primary"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feat)}
                      aria-label={`Quitar ${feat}`}
                      className="text-txt-secondary hover:text-rojo"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Image Uploader */}
          <CloudinaryImageUploader
            imageUrls={imageUrls}
            onChange={setImageUrls}
            onUploadingChange={setIsUploadingImages}
          />

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-rojo/30 bg-secondary px-3 py-2 text-sm text-rojo"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-borde pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSaving || isUploadingImages}
              onClick={onClose}
              className="border border-borde whitespace-nowrap"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              disabled={isUploadingImages}
              className="whitespace-nowrap"
            >
              {isUploadingImages
                ? 'Subiendo fotos...'
                : mode === 'create'
                  ? 'Crear chiva'
                  : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
