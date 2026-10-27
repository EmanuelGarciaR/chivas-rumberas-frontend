'use client'

import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-txt-primary"
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 w-full rounded-lg border border-borde bg-card px-3 text-sm text-txt-primary',
          'placeholder:text-txt-secondary',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-amarillo focus:ring-offset-0',
          error
            ? 'border-rojo focus:ring-rojo'
            : 'hover:border-amarillo',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rojo">{error}</p>
      ) : hint ? (
        <p className="text-xs text-txt-secondary">{hint}</p>
      ) : null}
    </div>
  )
})
