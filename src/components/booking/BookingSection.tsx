'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type {
  AvailabilityResponse,
  ChivaListItem,
  CreateBookingDto,
  Travel,
} from '@/lib/types'
import { createBooking, getAvailability } from '@/lib/api/bookings'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface BookingSectionProps {
  chivas: ChivaListItem[]
  travels: Travel[]
  loadError?: string
}

interface FormState {
  celebration: string
  chivaId: string
  travelId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  guestCount: string
  eventDate: string
  startTime: string
  notes: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const INITIAL_STATE: FormState = {
  celebration: '',
  chivaId: '',
  travelId: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  guestCount: '1',
  eventDate: '',
  startTime: '',
  notes: '',
}

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function validate(
  values: FormState,
  selectedChiva?: ChivaListItem,
  selectedTravel?: Travel,
): FieldErrors {
  const errors: FieldErrors = {}
  const guestCount = Number(values.guestCount)

  if (!values.celebration) errors.celebration = 'Selecciona el tipo de celebración'
  if (!values.chivaId) errors.chivaId = 'Selecciona una chiva'
  if (!values.travelId) errors.travelId = 'Selecciona un recorrido'
  if (!values.customerName.trim()) errors.customerName = 'El nombre es requerido'
  if (!values.customerEmail.trim()) errors.customerEmail = 'El correo es requerido'
  if (values.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.customerEmail)) {
    errors.customerEmail = 'Ingresa un correo válido'
  }
  const phoneDigits = values.customerPhone.replace(/\D/g, '')
  if (!values.customerPhone.trim()) {
    errors.customerPhone = 'El teléfono es requerido'
  } else if (!/^[+\d\s()-]+$/.test(values.customerPhone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.customerPhone = 'Ingresa un teléfono válido'
  }
  if (!values.eventDate) {
    errors.eventDate = 'La fecha es requerida'
  } else if (values.eventDate < getToday()) {
    errors.eventDate = 'La fecha no puede ser anterior a hoy'
  }
  if (!values.startTime) errors.startTime = 'La hora de inicio es requerida'
  if (!guestCount || guestCount < 1) {
    errors.guestCount = 'Debe ser al menos 1 persona'
  } else if (selectedChiva && guestCount > selectedChiva.capacity) {
    errors.guestCount = `La capacidad máxima es de ${selectedChiva.capacity} personas`
  }
  if (!selectedTravel) errors.travelId = 'Selecciona un recorrido válido'

  return errors
}

export function BookingSection({
  chivas,
  travels,
  loadError,
}: BookingSectionProps) {
  const router = useRouter()
  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(loadError ?? null)

  const selectedChiva = useMemo(
    () => chivas.find((chiva) => chiva.id === values.chivaId),
    [chivas, values.chivaId],
  )
  const selectedTravel = useMemo(
    () => travels.find((travel) => travel.id === values.travelId),
    [travels, values.travelId],
  )

  useEffect(() => {
    if (!values.chivaId || !values.eventDate) {
      const clearAvailability = window.setTimeout(
        () => setAvailability(null),
        0,
      )
      return () => window.clearTimeout(clearAvailability)
    }

    let active = true
    const markChecking = window.setTimeout(
      () => setIsCheckingAvailability(true),
      0,
    )
    getAvailability(values.chivaId, values.eventDate)
      .then((result) => {
        if (active) setAvailability(result)
      })
      .catch((error: unknown) => {
        if (active) {
          setServerError(
            error instanceof Error
              ? error.message
              : 'No fue posible consultar la disponibilidad.',
          )
        }
      })
      .finally(() => {
        if (active) setIsCheckingAvailability(false)
      })

    return () => {
      active = false
      window.clearTimeout(markChecking)
    }
  }, [values.chivaId, values.eventDate])

  const updateField = (field: keyof FormState, value: string) => {
    if (field === 'customerPhone') {
      value = value.replace(/[^\d+\s()-]/g, '')
    }

    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setServerError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fieldErrors = validate(values, selectedChiva, selectedTravel)
    setErrors(fieldErrors)
    setServerError(null)

    if (Object.keys(fieldErrors).length > 0 || !selectedTravel) return

    const dto: CreateBookingDto = {
      chivaId: values.chivaId,
      travelId: values.travelId,
      customerName: values.customerName.trim(),
      customerEmail: values.customerEmail.trim(),
      customerPhone: values.customerPhone.trim(),
      guestCount: Number(values.guestCount),
      eventDate: values.eventDate,
      startTime: values.startTime,
      durationHours: selectedTravel.durationHours,
      notes: [values.celebration, values.notes.trim()].filter(Boolean).join(' - ') || undefined,
    }

    setIsSubmitting(true)
    try {
      const booking = await createBooking(dto)
      router.push(`/confirmacion?id=${encodeURIComponent(booking.id)}`)
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'No fue posible enviar la solicitud de reserva.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const unavailable = availability?.isFullyBooked

  return (
    <section
      id="reserva"
      className="w-full bg-secondary px-6 py-20 sm:px-10 lg:px-20 lg:py-24"
      aria-labelledby="booking-title"
    >
      <header className="mx-auto max-w-6xl">
        <p className="font-primary text-sm uppercase tracking-[0.08em] text-rojo">
          06 — Reserva tu parche
        </p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="booking-title"
            className="font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] text-txt-primary"
          >
            ¿Listos para
            <br />
            <span className="font-secondary italic text-rojo">parcharnos?</span>
          </h2>
          <p className="max-w-[450px] font-primary text-base leading-relaxed text-txt-secondary">
            Cuéntanos un poco y te respondemos con una propuesta hecha para
            ustedes.
          </p>
        </div>
      </header>

      <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-2xl bg-card p-6 shadow-sm sm:p-8"
          aria-label="Formulario de reserva"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="¿Qué vamos a celebrar?"
              value={values.celebration}
              onChange={(event) => updateField('celebration', event.target.value)}
              options={[
                { value: 'Cumpleaños', label: 'Cumpleaños' },
                { value: 'Despedida', label: 'Despedida' },
                { value: 'Tour por Medellín', label: 'Tour por Medellín' },
                { value: 'Corporativo', label: 'Corporativo' },
              ]}
              placeholder="Elige una opción"
              error={errors.celebration}
              required
            />
            <Select
              label="Elige tu chiva"
              value={values.chivaId}
              onChange={(event) => updateField('chivaId', event.target.value)}
              options={chivas.map((chiva) => ({
                value: chiva.id,
                label: `${chiva.name} — hasta ${chiva.capacity} personas`,
              }))}
              placeholder={chivas.length ? 'Selecciona una chiva' : 'No hay chivas disponibles'}
              error={errors.chivaId}
              disabled={!chivas.length}
              required
            />
          </div>

          <Select
            label="Recorrido"
            value={values.travelId}
            onChange={(event) => updateField('travelId', event.target.value)}
            options={travels.map((travel) => ({
              value: travel.id,
              label: `${travel.name} — ${travel.durationHours} horas`,
            }))}
            placeholder={travels.length ? 'Selecciona un recorrido' : 'No hay recorridos disponibles'}
            error={errors.travelId}
            disabled={!travels.length}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre completo"
              value={values.customerName}
              onChange={(event) => updateField('customerName', event.target.value)}
              error={errors.customerName}
              required
            />
            <Input
              label="Teléfono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              value={values.customerPhone}
              onChange={(event) => updateField('customerPhone', event.target.value)}
              error={errors.customerPhone}
              required
            />
          </div>

          <Input
            label="Correo electrónico"
            type="email"
            value={values.customerEmail}
            onChange={(event) => updateField('customerEmail', event.target.value)}
            error={errors.customerEmail}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Fecha"
              type="date"
              min={getToday()}
              value={values.eventDate}
              onChange={(event) => updateField('eventDate', event.target.value)}
              error={errors.eventDate}
              required
            />
            <Input
              label="Hora de inicio"
              type="time"
              value={values.startTime}
              onChange={(event) => updateField('startTime', event.target.value)}
              error={errors.startTime}
              required
            />
            <Input
              label="Personas"
              type="number"
              min="1"
              max={selectedChiva ? String(selectedChiva.capacity) : undefined}
              value={values.guestCount}
              onChange={(event) => updateField('guestCount', event.target.value)}
              error={errors.guestCount}
              required
            />
          </div>

          {isCheckingAvailability ? (
            <p className="text-sm text-txt-secondary">Consultando disponibilidad...</p>
          ) : availability ? (
            <p className={unavailable ? 'text-sm text-rojo' : 'text-sm text-txt-secondary'}>
              {unavailable
                ? 'Esta chiva está completamente ocupada para esa fecha.'
                : 'La chiva tiene disponibilidad para esa fecha.'}
            </p>
          ) : null}

          <Textarea
            label="Notas adicionales (opcional)"
            value={values.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Cuéntanos cómo quieres vivir tu parche..."
          />

          {serverError ? (
            <p className="rounded-lg border border-rojo/30 bg-crema-claro px-4 py-3 text-sm text-rojo">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" size="lg" isLoading={isSubmitting} disabled={unavailable}>
            Enviar solicitud
          </Button>
        </form>

        <aside className="hidden items-center justify-center rounded-2xl bg-[var(--color-negro-profundo)] p-8 lg:flex">
          <Image
            src="/icons/logo-chiva-ia.svg"
            alt="Logo Chivas Rumberas"
            width={190}
            height={190}
            className="h-auto w-full max-w-[190px]"
          />
        </aside>
      </div>
    </section>
  )
}
