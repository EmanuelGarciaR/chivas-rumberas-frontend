'use client'

import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, className, id, ...props },
  ref,
) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-txt-primary">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-10 w-full rounded-lg border border-borde bg-card px-3 text-sm text-txt-primary',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-amarillo focus:ring-offset-0',
          error
            ? 'border-rojo focus:ring-rojo'
            : 'hover:border-amarillo',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-rojo">{error}</p> : null}
    </div>
  )
})
