'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  href?: string
  children: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-amarillo text-negro hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-amarillo',
  secondary:
    'bg-transparent text-blanco border border-borde hover:bg-secondary focus-visible:ring-borde',
  ghost:
    'bg-transparent text-txt-primary hover:bg-secondary focus-visible:ring-borde',
  danger:
    'bg-rojo text-blanco hover:opacity-90 focus-visible:ring-rojo',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'h-[60px] px-8 text-md', // Mantenemos h-[60px] porque es una altura específica, no un color
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  href,
  children,
  ...props
}: ButtonProps) {
  const computedClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
    'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={computedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={computedClassName}
      {...props}
    >
      {isLoading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}
