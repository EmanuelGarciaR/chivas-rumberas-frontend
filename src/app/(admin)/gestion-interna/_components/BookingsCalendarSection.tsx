'use client'

import Link from 'next/link'
import {
  ViewTransition,
  addTransitionType,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  CalendarDay,
  CalendarMonthResponse,
  ChivaListItem,
} from '@/lib/types'
import { cn, formatDate, formatDateLong } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

interface BookingsCalendarSectionProps {
  initialMonth: string
  todayIso: string
  initialData: CalendarMonthResponse | null
  initialError: string | null
  allChivas: ChivaListItem[]
}

interface ChivaColorStyle {
  swatchClass: string
  cellClass: string
  stripeColor: string
  initial: string
}

const CHIVA_PALETTE: Omit<ChivaColorStyle, 'initial'>[] = [
  {
    swatchClass: 'bg-amarillo text-negro border border-amarillo',
    cellClass: 'bg-amarillo/25 border-amarillo text-txt-primary',
    stripeColor: 'var(--color-amarillo)',
  },
  {
    swatchClass: 'bg-rojo text-crema-claro border border-rojo',
    cellClass: 'bg-rojo/20 border-rojo text-txt-primary',
    stripeColor: 'var(--color-rojo)',
  },
  {
    swatchClass: 'bg-secondary text-txt-primary border-2 border-amarillo',
    cellClass: 'bg-secondary border-2 border-amarillo text-txt-primary',
    stripeColor: 'var(--color-crema-calido)',
  },
  {
    swatchClass: 'bg-[var(--bg-dark-panel)] text-amarillo border border-amarillo',
    cellClass: 'bg-[var(--bg-dark-panel)] text-amarillo border-amarillo',
    stripeColor: 'var(--bg-dark-panel)',
  },
  {
    swatchClass: 'bg-card text-rojo border-2 border-rojo',
    cellClass: 'bg-card border-2 border-rojo text-txt-primary',
    stripeColor: 'var(--color-gris-medio)',
  },
]

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function parseYearMonth(ym: string): { year: number; month: number } {
  const [y, m] = ym.split('-').map(Number)
  return { year: y, month: m }
}

function shiftMonth(ym: string, delta: number): string {
  const { year, month } = parseYearMonth(ym)
  const d = new Date(Date.UTC(year, month - 1 + delta, 1, 12, 0, 0))
  const nextY = d.getUTCFullYear()
  const nextM = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${nextY}-${nextM}`
}

function formatMonthTitle(ym: string): string {
  const { year, month } = parseYearMonth(ym)
  return `${MONTH_NAMES[month - 1] ?? ''} ${year}`
}

function buildMonthGrid(ym: string): { dayNumber: number; isoDate: string }[] {
  const { year, month } = parseYearMonth(ym)
  const firstDay = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0))
  const daysInMonth = new Date(Date.UTC(year, month, 0, 12, 0, 0)).getUTCDate()

  // Convert JS getUTCDay (0=Sun..6=Sat) to Monday-first (0=Mon..6=Sun)
  const startOffset = (firstDay.getUTCDay() + 6) % 7
  const cells: { dayNumber: number; isoDate: string }[] = []

  for (let i = 0; i < startOffset; i++) {
    cells.push({ dayNumber: 0, isoDate: `pad-start-${i}` })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0')
    cells.push({ dayNumber: day, isoDate: `${ym}-${dayStr}` })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ dayNumber: 0, isoDate: `pad-end-${cells.length}` })
  }

  return cells
}

function getChivaInitial(name: string): string {
  const cleaned = name.replace(/^la\s+/i, '').trim()
  return (cleaned.charAt(0) || name.charAt(0) || 'C').toUpperCase()
}

export function BookingsCalendarSection({
  initialMonth,
  todayIso,
  initialData,
  initialError,
  allChivas,
}: BookingsCalendarSectionProps) {
  const [month, setMonth] = useState(initialMonth)
  const [data, setData] = useState<CalendarMonthResponse | null>(initialData)
  const [error, setError] = useState<string | null>(initialError)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

  const sortedChivas = useMemo(
    () => [...allChivas].sort((a, b) => a.id.localeCompare(b.id)),
    [allChivas],
  )

  const chivaStyleMap = useMemo(() => {
    const map = new Map<string, ChivaColorStyle>()
    sortedChivas.forEach((chiva, idx) => {
      const palette = CHIVA_PALETTE[idx % CHIVA_PALETTE.length]
      map.set(chiva.id, {
        ...palette,
        initial: getChivaInitial(chiva.name),
      })
    })
    return map
  }, [sortedChivas])

  const dayMap = useMemo(() => {
    const map = new Map<string, CalendarDay>()
    for (const day of data?.days ?? []) {
      map.set(day.date, day)
    }
    return map
  }, [data])

  const gridCells = useMemo(() => buildMonthGrid(month), [month])
  const todayMonth = todayIso.slice(0, 7)

  useEffect(() => {
    if (!selectedDay) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDay(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedDay])

  async function loadMonth(targetMonth: string, direction: 'cal-prev' | 'cal-next' | 'fade') {
    setIsLoading(true)
    setError(null)
    setSelectedDay(null)

    const url = new URL(window.location.href)
    url.searchParams.set('month', targetMonth)
    window.history.replaceState(null, '', url.toString())

    try {
      const res = await fetch(
        `/api/admin/bookings/calendar?month=${encodeURIComponent(targetMonth)}`,
        { cache: 'no-store' },
      )
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(
          body?.error?.message ?? 'No fue posible cargar el calendario del mes.',
        )
      }

      startTransition(() => {
        if (direction !== 'fade') {
          addTransitionType(direction)
        }
        setMonth(targetMonth)
        setData(body as CalendarMonthResponse)
      })
    } catch (reason: unknown) {
      startTransition(() => {
        setMonth(targetMonth)
        setError(
          reason instanceof Error
            ? reason.message
            : 'No fue posible cargar el calendario del mes.',
        )
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handlePrevMonth() {
    void loadMonth(shiftMonth(month, -1), 'cal-prev')
  }

  function handleNextMonth() {
    void loadMonth(shiftMonth(month, 1), 'cal-next')
  }

  function handleToday() {
    const dir =
      todayMonth < month ? 'cal-prev' : todayMonth > month ? 'cal-next' : 'fade'
    void loadMonth(todayMonth, dir)
  }

  return (
    <section
      aria-labelledby="calendar-section-title"
      className="mt-8 rounded-xl border border-borde bg-card p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="calendar-section-title" className="text-lg font-bold text-txt-primary">
            Calendario de chivas confirmadas
          </h2>
          <p className="mt-0.5 text-sm text-txt-secondary">
            {formatMonthTitle(month)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={handlePrevMonth}
            aria-label="Mes anterior"
            className="border border-borde whitespace-nowrap"
          >
            &larr; Anterior
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading || month === todayMonth}
            onClick={handleToday}
            className="border border-borde whitespace-nowrap"
          >
            Hoy
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={handleNextMonth}
            aria-label="Mes siguiente"
            className="border border-borde whitespace-nowrap"
          >
            Siguiente &rarr;
          </Button>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div
          role="alert"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rojo/30 bg-secondary p-4 text-sm text-rojo"
        >
          <span>{error}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void loadMonth(month, 'fade')}
            className="border border-borde whitespace-nowrap"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      {/* Calendar Grid */}
      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <ViewTransition
          key={month}
          enter={{
            'cal-next': 'cal-next',
            'cal-prev': 'cal-prev',
            default: 'fade-soft',
          }}
          exit={{
            'cal-next': 'cal-next',
            'cal-prev': 'cal-prev',
            default: 'fade-soft',
          }}
          default="none"
        >
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-txt-secondary sm:gap-2">
              {WEEKDAYS.map((wd) => (
                <div key={wd} className="py-1.5">
                  {wd}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="mt-1 grid grid-cols-7 gap-1.5 sm:gap-2">
              {gridCells.map((cell) => {
                if (cell.dayNumber === 0) {
                  return (
                    <div
                      key={cell.isoDate}
                      aria-hidden="true"
                      className="min-h-[72px] rounded-lg bg-secondary/20 sm:min-h-[88px]"
                    />
                  )
                }

                const dayInfo = dayMap.get(cell.isoDate)
                const isToday = cell.isoDate === todayIso
                const isSelected = selectedDay?.date === cell.isoDate

                if (!dayInfo) {
                  return (
                    <div
                      key={cell.isoDate}
                      className={cn(
                        'flex min-h-[72px] flex-col justify-between rounded-lg border border-borde/60 bg-primary/40 p-2 sm:min-h-[88px]',
                        isToday && 'ring-2 ring-amarillo ring-offset-1',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                          isToday
                            ? 'bg-amarillo font-bold text-negro'
                            : 'text-txt-secondary',
                        )}
                      >
                        {cell.dayNumber}
                      </span>
                    </div>
                  )
                }

                const isMultiple = dayInfo.chivasCount >= 2
                const singleChiva = dayInfo.chivas[0]
                const singleStyle = singleChiva
                  ? chivaStyleMap.get(singleChiva.chivaId)
                  : undefined

                const ariaLabel = `${formatDateLong(cell.isoDate)}, ${dayInfo.chivasCount} ${
                  dayInfo.chivasCount === 1 ? 'chiva ocupada' : 'chivas ocupadas'
                }`

                return (
                  <button
                    key={cell.isoDate}
                    type="button"
                    onClick={() => setSelectedDay(dayInfo)}
                    aria-label={ariaLabel}
                    aria-pressed={isSelected}
                    className={cn(
                      'group relative flex min-h-[72px] flex-col justify-between overflow-hidden rounded-lg border p-2 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-1 sm:min-h-[88px]',
                      !isMultiple && singleStyle
                        ? singleStyle.cellClass
                        : 'border-borde bg-card text-txt-primary',
                      isToday && 'ring-2 ring-amarillo ring-offset-1',
                      isSelected && 'ring-2 ring-rojo ring-offset-1',
                    )}
                  >
                    {/* Multi-chiva top color stripes */}
                    {isMultiple ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 flex h-2 w-full"
                      >
                        {dayInfo.chivas.map((c) => {
                          const st = chivaStyleMap.get(c.chivaId)
                          return (
                            <span
                              key={c.chivaId}
                              className="h-full flex-1"
                              style={{
                                backgroundColor:
                                  st?.stripeColor ?? 'var(--color-amarillo)',
                              }}
                            />
                          )
                        })}
                      </span>
                    ) : null}

                    <div className={cn('flex items-center justify-between gap-1', isMultiple && 'pt-1')}>
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                          isToday
                            ? 'bg-amarillo text-negro'
                            : 'text-txt-primary',
                        )}
                      >
                        {cell.dayNumber}
                      </span>

                      {isMultiple ? (
                        <span className="rounded-full bg-rojo px-1.5 py-0.5 text-[10px] font-bold text-crema-claro">
                          {dayInfo.chivasCount}
                        </span>
                      ) : singleStyle ? (
                        <span
                          className={cn(
                            'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                            singleStyle.swatchClass,
                          )}
                        >
                          {singleStyle.initial}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 space-y-0.5">
                      {isMultiple ? (
                        <p className="truncate text-[11px] font-semibold text-txt-primary">
                          {dayInfo.chivasCount} chivas
                        </p>
                      ) : (
                        <p className="truncate text-[11px] font-semibold text-txt-primary">
                          {singleChiva?.chivaName}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {data && data.days.length === 0 ? (
              <p className="mt-4 rounded-lg bg-secondary/50 px-4 py-3 text-center text-sm text-txt-secondary">
                Sin chivas confirmadas este mes
              </p>
            ) : null}
          </div>
        </ViewTransition>
      )}

      {/* Legend */}
      <div className="mt-5 border-t border-borde pt-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-txt-secondary">
          Leyenda de flota
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {sortedChivas.map((chiva) => {
            const style = chivaStyleMap.get(chiva.id)
            if (!style) return null
            return (
              <div
                key={chiva.id}
                className="inline-flex items-center gap-2 rounded-full border border-borde bg-primary/60 px-3 py-1 text-xs"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    style.swatchClass,
                  )}
                >
                  {style.initial}
                </span>
                <span className="font-medium text-txt-primary">
                  {chiva.name}
                  {chiva.status === 'retired' ? ' (Retirada)' : ''}
                </span>
              </div>
            )
          })}

          <div className="inline-flex items-center gap-2 rounded-full border border-borde bg-primary/60 px-3 py-1 text-xs">
            <span
              aria-hidden="true"
              className="inline-flex h-3 w-6 overflow-hidden rounded-sm border border-borde"
            >
              <span className="h-full flex-1 bg-amarillo" />
              <span className="h-full flex-1 bg-rojo" />
            </span>
            <span className="text-txt-secondary">
              Franjas divididas: 2 o más chivas ocupadas ese día
            </span>
          </div>
        </div>
      </div>

      {/* Day Detail Drawer (Desktop side panel / Mobile bottom sheet) */}
      {selectedDay ? (
        <DayDetailSheet
          day={selectedDay}
          chivaStyleMap={chivaStyleMap}
          onClose={() => setSelectedDay(null)}
        />
      ) : null}
    </section>
  )
}

function DayDetailSheet({
  day,
  chivaStyleMap,
  onClose,
}: {
  day: CalendarDay
  chivaStyleMap: Map<string, ChivaColorStyle>
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/50 sm:items-stretch sm:justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-detail-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border-t border-borde bg-card p-6 text-txt-primary shadow-xl sm:max-h-none sm:h-full sm:w-full sm:max-w-md sm:rounded-none sm:border-l sm:border-t-0"
        style={{ animation: 'vt-slide-up-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-borde pb-4">
          <div>
            <h3 id="day-detail-title" className="text-lg font-bold capitalize">
              {formatDate(day.date)}
            </h3>
            {day.chivasCount > 1 ? (
              <p className="mt-1 text-sm font-medium text-rojo">
                {day.chivasCount} chivas ocupadas este día
              </p>
            ) : (
              <p className="mt-1 text-sm text-txt-secondary">
                1 chiva ocupada este día
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle del día"
            className="rounded-lg border border-borde px-2.5 py-1 text-xs font-medium text-txt-secondary hover:border-amarillo hover:text-txt-primary"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {day.chivas.map((chivaDay) => {
            const style = chivaStyleMap.get(chivaDay.chivaId)
            return (
              <div
                key={chivaDay.chivaId}
                className="rounded-xl border border-borde bg-primary/50 p-4"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  {style ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                        style.swatchClass,
                      )}
                    >
                      {style.initial}
                    </span>
                  ) : null}
                  <h4 className="font-semibold text-txt-primary">
                    {chivaDay.chivaName}
                  </h4>
                </div>

                <ul className="space-y-3">
                  {chivaDay.slots.map((slot) => (
                    <li
                      key={slot.bookingId}
                      className="rounded-lg border border-borde bg-card p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-txt-primary">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-xs text-txt-secondary">
                          {slot.durationHours} h
                        </span>
                      </div>
                      {slot.endsNextDay ? (
                        <p className="mt-1 text-xs font-medium text-rojo">
                          Termina al día siguiente
                        </p>
                      ) : null}
                      <p className="mt-2 font-medium text-txt-primary">
                        {slot.customerName}
                      </p>
                      <p className="text-xs text-txt-secondary">
                        {slot.travelName} · {slot.guestCount} invitados
                      </p>
                      <div className="mt-2.5">
                        <Link
                          href={`/gestion-interna/reservas/${slot.bookingId}`}
                          className="text-xs font-semibold text-rojo hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo"
                        >
                          Ver reserva {slot.bookingId} &rarr;
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CalendarSkeleton() {
  return (
    <div aria-label="Cargando calendario" aria-busy="true" className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-5 bg-secondary" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg bg-secondary" />
        ))}
      </div>
    </div>
  )
}
