'use client'

import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, className, id, ...props }, ref) {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-txt-primary"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          className={cn(
            'w-full resize-none rounded-lg border border-borde bg-card px-3 py-2 text-sm text-txt-primary',
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
  },
)
