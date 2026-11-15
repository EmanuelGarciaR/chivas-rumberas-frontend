'use client'

import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, idx) => idx + 1)
  }

  const items: PageItem[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)

  if (left > 2) {
    items.push('ellipsis-left')
  }

  for (let p = left; p <= right; p++) {
    items.push(p)
  }

  if (right < total - 1) {
    items.push('ellipsis-right')
  }

  items.push(total)
  return items
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(page, totalPages)
  const isFirst = page <= 1 || disabled
  const isLast = page >= totalPages || disabled

  return (
    <nav
      aria-label="Paginación"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
    >
      <p className="text-sm text-txt-secondary">
        Página <span className="font-medium text-txt-primary">{page}</span> de{' '}
        <span className="font-medium text-txt-primary">{totalPages}</span>
      </p>

      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-borde bg-card px-3 text-sm font-medium text-txt-primary transition-colors hover:border-amarillo hover:text-rojo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Anterior</span>
          </button>
        </li>

        {items.map((item) => {
          if (item === 'ellipsis-left' || item === 'ellipsis-right') {
            return (
              <li
                key={item}
                aria-hidden="true"
                className="flex h-9 min-w-8 items-center justify-center text-sm text-txt-secondary select-none"
              >
                &hellip;
              </li>
            )
          }

          const isActive = item === page
          return (
            <li key={item}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!isActive) onPageChange(item)
                }}
                aria-label={`Página ${item}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex h-9 min-w-9 items-center justify-center whitespace-nowrap rounded-lg px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
                  isActive
                    ? 'bg-amarillo font-semibold text-negro'
                    : 'border border-borde bg-card text-txt-primary hover:border-amarillo hover:text-rojo',
                )}
              >
                {item}
              </button>
            </li>
          )
        })}

        <li>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
            aria-label="Página siguiente"
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-borde bg-card px-3 text-sm font-medium text-txt-primary transition-colors hover:border-amarillo hover:text-rojo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40"
          >
            <span>Siguiente</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
