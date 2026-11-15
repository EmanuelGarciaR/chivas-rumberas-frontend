const BOGOTA_TIMEZONE = 'America/Bogota'

const DATE_FORMAT = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: BOGOTA_TIMEZONE,
})

const DATE_LONG_FORMAT = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: BOGOTA_TIMEZONE,
})

const DATETIME_BOGOTA_FORMAT = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: BOGOTA_TIMEZONE,
})

const TIME_FORMAT = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

const YMD_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

function parseDateSafe(input: string): Date {
  const match = YMD_REGEX.exec(input.trim())
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    // Anchor at noon UTC so America/Bogota (UTC-5) always resolves to the exact calendar day.
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  }
  return new Date(input)
}

export function formatDate(iso: string): string {
  return DATE_FORMAT.format(parseDateSafe(iso))
}

export function formatDateLong(iso: string): string {
  return DATE_LONG_FORMAT.format(parseDateSafe(iso))
}

export function formatDateTimeBogota(isoUtc: string): string {
  return DATETIME_BOGOTA_FORMAT.format(new Date(isoUtc))
}

export function formatTime(hhmm: string): string {
  const [hours, minutes] = hhmm.split(':').map(Number)
  const d = new Date(Date.UTC(1970, 0, 1, hours, minutes))
  d.setHours(hours, minutes, 0, 0)
  return TIME_FORMAT.format(d)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayBogota(): {
  year: number
  month: number
  day: number
  isoDate: string
  yearMonth: string
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOGOTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const yearStr = parts.find((p) => p.type === 'year')?.value ?? '2026'
  const monthStr = parts.find((p) => p.type === 'month')?.value ?? '01'
  const dayStr = parts.find((p) => p.type === 'day')?.value ?? '01'

  return {
    year: Number(yearStr),
    month: Number(monthStr),
    day: Number(dayStr),
    isoDate: `${yearStr}-${monthStr}-${dayStr}`,
    yearMonth: `${yearStr}-${monthStr}`,
  }
}
