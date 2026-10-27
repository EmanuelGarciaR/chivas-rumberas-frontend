'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@/components/icons'

const THEME_STORAGE_KEY = 'chivas-rumberas-theme'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    const dark = savedTheme === 'dark'

    document.documentElement.dataset.theme = dark ? 'dark' : 'light'

    const syncState = window.setTimeout(() => setIsDark(dark), 0)
    return () => window.clearTimeout(syncState)
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !isDark

    document.documentElement.dataset.theme = nextIsDark ? 'dark' : 'light'
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextIsDark ? 'dark' : 'light',
    )
    setIsDark(nextIsDark)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full p-1 text-amarillo transition-colors hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo"
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <SunIcon size={18} aria-hidden="true" />
      ) : (
        <MoonIcon size={18} aria-hidden="true" />
      )}
    </button>
  )
}
