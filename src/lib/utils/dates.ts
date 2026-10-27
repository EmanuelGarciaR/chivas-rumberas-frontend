const DATE_FORMAT = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const TIME_FORMAT = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export function formatDate(iso: string): string {
  return DATE_FORMAT.format(new Date(iso))
}

export function formatTime(hhmm: string): string {
  const [hours, minutes] = hhmm.split(':').map(Number)
  const d = new Date()
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
  return date.toISOString().split('T')[0]
}
