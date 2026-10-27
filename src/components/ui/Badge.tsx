import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'border border-borde bg-card text-txt-secondary',
  success: 'bg-amarillo text-negro',
  warning: 'bg-crema-calido text-negro-profundo',
  danger: 'bg-rojo text-crema-claro',
  info: 'border border-amarillo bg-amarillo/20 text-negro-profundo',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
