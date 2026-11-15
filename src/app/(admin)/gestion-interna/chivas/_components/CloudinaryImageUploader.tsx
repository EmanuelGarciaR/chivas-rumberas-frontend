'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { UploadSignatureResponse } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface CloudinaryImageUploaderProps {
  imageUrls: string[]
  onChange: (urls: string[]) => void
  onUploadingChange?: (isUploading: boolean) => void
  maxFiles?: number
}

interface UploadItem {
  localId: string
  file: File
  previewUrl: string
  progress: number
  status: 'uploading' | 'error'
  errorMessage?: string
}

const FORMAT_MIME_MAP: Record<string, string[]> = {
  jpg: ['image/jpeg', 'image/jpg'],
  jpeg: ['image/jpeg', 'image/jpg'],
  png: ['image/png'],
  webp: ['image/webp'],
}

function isFileFormatAllowed(file: File, allowedFormats: string[]): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const mime = file.type.toLowerCase()

  return allowedFormats.some((fmt) => {
    const normalized = fmt.toLowerCase()
    if (ext === normalized || (normalized === 'jpg' && ext === 'jpeg')) {
      return true
    }
    const mimes = FORMAT_MIME_MAP[normalized] ?? []
    return mimes.includes(mime)
  })
}

export function CloudinaryImageUploader({
  imageUrls,
  onChange,
  onUploadingChange,
  maxFiles = 10,
}: CloudinaryImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const urlsRef = useRef<string[]>(imageUrls)
  urlsRef.current = imageUrls

  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const uploadsRef = useRef<UploadItem[]>(uploads)
  uploadsRef.current = uploads

  useEffect(() => {
    onUploadingChange?.(uploads.some((u) => u.status === 'uploading'))
  }, [uploads, onUploadingChange])

  useEffect(() => {
    return () => {
      for (const item of uploadsRef.current) {
        URL.revokeObjectURL(item.previewUrl)
      }
    }
  }, [])

  async function fetchSignature(): Promise<UploadSignatureResponse> {
    const res = await fetch('/api/admin/uploads/signature', { cache: 'no-store' })
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      throw new Error(
        body?.error?.message ?? 'No fue posible obtener la firma de subida.',
      )
    }
    return body as UploadSignatureResponse
  }

  function uploadSingleFile(
    item: UploadItem,
    sig: UploadSignatureResponse,
  ): Promise<void> {
    return new Promise((resolve) => {
      const formData = new FormData()
      formData.append('file', item.file)
      formData.append('api_key', sig.apiKey)
      formData.append('timestamp', String(sig.timestamp))
      formData.append('signature', sig.signature)
      formData.append('folder', sig.folder)
      formData.append('allowed_formats', sig.allowedFormats.join(','))
      formData.append('max_file_size', String(sig.maxFileSize))

      const xhr = new XMLHttpRequest()
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloudName)}/image/upload`,
      )

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return
        const pct = Math.round((event.loaded / event.total) * 100)
        setUploads((prev) =>
          prev.map((u) => (u.localId === item.localId ? { ...u, progress: pct } : u)),
        )
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const parsed = JSON.parse(xhr.responseText) as { secure_url?: string }
            if (parsed.secure_url) {
              const nextUrls = [...urlsRef.current, parsed.secure_url]
              urlsRef.current = nextUrls
              onChange(nextUrls)
              URL.revokeObjectURL(item.previewUrl)
              setUploads((prev) => prev.filter((u) => u.localId !== item.localId))
              resolve()
              return
            }
          } catch {
            // fall through to error
          }
        }

        let errMsg = `Error de Cloudinary (HTTP ${xhr.status})`
        try {
          const errBody = JSON.parse(xhr.responseText) as {
            error?: { message?: string }
          }
          if (errBody?.error?.message) {
            errMsg = errBody.error.message
          }
        } catch {
          // ignore parse error
        }

        setUploads((prev) =>
          prev.map((u) =>
            u.localId === item.localId
              ? { ...u, status: 'error', errorMessage: errMsg }
              : u,
          ),
        )
        resolve()
      }

      xhr.onerror = () => {
        setUploads((prev) =>
          prev.map((u) =>
            u.localId === item.localId
              ? {
                  ...u,
                  status: 'error',
                  errorMessage: 'Error de red al subir la imagen.',
                }
              : u,
          ),
        )
        resolve()
      }

      xhr.send(formData)
    })
  }

  async function handleFiles(fileList: FileList | File[]) {
    setValidationError(null)
    const files = Array.from(fileList)
    if (files.length === 0) return

    const currentCount = urlsRef.current.length + uploadsRef.current.length
    const availableSlots = maxFiles - currentCount
    if (availableSlots <= 0) {
      setValidationError(`Máximo ${maxFiles} fotos por chiva.`)
      return
    }

    const selected = files.slice(0, availableSlots)
    if (files.length > availableSlots) {
      setValidationError(
        `Solo se agregaron ${availableSlots} archivos para no superar el máximo de ${maxFiles} fotos.`,
      )
    }

    let sig: UploadSignatureResponse
    try {
      sig = await fetchSignature()
    } catch (err: unknown) {
      setValidationError(
        err instanceof Error
          ? err.message
          : 'No fue posible preparar la subida de imágenes.',
      )
      return
    }

    const validItems: UploadItem[] = []
    const rejectedMessages: string[] = []

    for (const file of selected) {
      if (!isFileFormatAllowed(file, sig.allowedFormats)) {
        rejectedMessages.push(
          `${file.name}: formato no permitido (usa ${sig.allowedFormats.join(', ')}).`,
        )
        continue
      }
      if (file.size > sig.maxFileSize) {
        const maxMb = Math.round((sig.maxFileSize / (1024 * 1024)) * 10) / 10
        rejectedMessages.push(`${file.name}: supera el máximo de ${maxMb} MB.`)
        continue
      }
      validItems.push({
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading',
      })
    }

    if (rejectedMessages.length > 0) {
      setValidationError(rejectedMessages.join(' '))
    }

    if (validItems.length === 0) return

    setUploads((prev) => [...prev, ...validItems])
    await Promise.all(validItems.map((item) => uploadSingleFile(item, sig)))
  }

  async function handleRetry(localId: string) {
    const target = uploadsRef.current.find((u) => u.localId === localId)
    if (!target) return

    setValidationError(null)
    setUploads((prev) =>
      prev.map((u) =>
        u.localId === localId
          ? { ...u, status: 'uploading', progress: 0, errorMessage: undefined }
          : u,
      ),
    )

    try {
      const sig = await fetchSignature()
      await uploadSingleFile(target, sig)
    } catch (err: unknown) {
      setUploads((prev) =>
        prev.map((u) =>
          u.localId === localId
            ? {
                ...u,
                status: 'error',
                errorMessage:
                  err instanceof Error ? err.message : 'No fue posible obtener firma.',
              }
            : u,
        ),
      )
    }
  }

  function handleCancelUpload(localId: string) {
    const target = uploadsRef.current.find((u) => u.localId === localId)
    if (target) {
      URL.revokeObjectURL(target.previewUrl)
    }
    setUploads((prev) => prev.filter((u) => u.localId !== localId))
  }

  function handleRemoveUrl(index: number) {
    onChange(imageUrls.filter((_, idx) => idx !== index))
  }

  function handleMove(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= imageUrls.length) return
    const copy = [...imageUrls]
    const [moved] = copy.splice(index, 1)
    copy.splice(nextIndex, 0, moved)
    onChange(copy)
  }

  const totalCount = imageUrls.length + uploads.length
  const canAddMore = totalCount < maxFiles

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-txt-primary">
          Fotos ({imageUrls.length}/{maxFiles})
        </span>
        <span className="text-xs text-txt-secondary">
          La primera foto será la portada principal
        </span>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (canAddMore) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (canAddMore && e.dataTransfer.files.length > 0) {
            void handleFiles(e.dataTransfer.files)
          }
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center transition-colors',
          isDragging
            ? 'border-amarillo bg-amarillo/10'
            : 'border-borde bg-secondary/40',
          !canAddMore && 'opacity-60',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={!canAddMore}
          onChange={(e) => {
            if (e.target.files) {
              void handleFiles(e.target.files)
              e.target.value = ''
            }
          }}
        />
        <p className="text-sm font-medium text-txt-primary">
          Arrastra tus fotos aquí o{' '}
          <button
            type="button"
            disabled={!canAddMore}
            onClick={() => fileInputRef.current?.click()}
            className="text-rojo underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo disabled:pointer-events-none"
          >
            selecciona archivos
          </button>
        </p>
        <p className="mt-1 text-xs text-txt-secondary">
          JPG, PNG o WebP. Máximo 5 MB por archivo y {maxFiles} fotos en total.
        </p>
      </div>

      {validationError ? (
        <p role="alert" className="rounded-lg border border-rojo/30 bg-card px-3 py-2 text-xs text-rojo">
          {validationError}
        </p>
      ) : null}

      {/* Uploaded + active items */}
      {imageUrls.length > 0 || uploads.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {imageUrls.map((url, idx) => (
            <li
              key={`${url}-${idx}`}
              className="flex items-center gap-3 rounded-xl border border-borde bg-card p-2.5"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={url}
                  alt={`Foto ${idx + 1} de la chiva`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {idx === 0 ? (
                    <span className="rounded-full bg-amarillo px-2 py-0.5 text-[11px] font-semibold text-negro">
                      Principal
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-txt-secondary">
                      Foto {idx + 1}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    aria-label={`Mover foto ${idx + 1} hacia arriba`}
                    className="rounded border border-borde px-2 py-0.5 text-xs text-txt-primary transition-colors hover:border-amarillo disabled:pointer-events-none disabled:opacity-40"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    disabled={idx === imageUrls.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    aria-label={`Mover foto ${idx + 1} hacia abajo`}
                    className="rounded border border-borde px-2 py-0.5 text-xs text-txt-primary transition-colors hover:border-amarillo disabled:pointer-events-none disabled:opacity-40"
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(idx)}
                    aria-label={`Eliminar foto ${idx + 1}`}
                    className="ml-auto rounded px-2 py-0.5 text-xs font-medium text-rojo hover:bg-rojo/10"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}

          {uploads.map((item) => (
            <li
              key={item.localId}
              className="flex items-center gap-3 rounded-xl border border-borde bg-card p-2.5"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={item.previewUrl}
                  alt={`Subiendo ${item.file.name}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-txt-primary">
                  {item.file.name}
                </p>
                {item.status === 'uploading' ? (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-amarillo transition-[width] duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-txt-secondary">
                      Subiendo {item.progress}%
                    </p>
                  </div>
                ) : (
                  <div className="mt-1.5 space-y-1">
                    <p className="text-[11px] text-rojo">{item.errorMessage}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => void handleRetry(item.localId)}
                        className="h-7 border border-borde px-2 text-xs"
                      >
                        Reintentar
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleCancelUpload(item.localId)}
                        className="text-xs text-txt-secondary hover:text-rojo"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
