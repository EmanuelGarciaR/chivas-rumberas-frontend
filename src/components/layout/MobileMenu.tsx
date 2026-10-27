'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRightIcon, MenuIcon } from '@/components/icons'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '#la-experiencia', label: 'La experiencia' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#nuestras-chivas', label: 'Nuestras chivas' },
  { href: '#como-funciona', label: 'Cómo funciona' },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        className="mr-5 inline-flex items-center justify-center rounded-md p-2 text-amarillo transition-colors hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo lg:hidden"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <MenuIcon size={26} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 top-[100px] z-[999] bg-black/50 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      ) : null}

      <nav
        id="mobile-navigation"
        className={[
          'absolute left-0 top-[100px] w-full border-t border-[var(--border-color)]/30 bg-primary px-6 py-8 shadow-lg transition-[visibility,opacity,transform] duration-300 sm:px-10 lg:hidden',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0',
        ].join(' ')}
        aria-label="Navegación móvil"
        aria-hidden={!isOpen}
      >
        <ul className="flex flex-col items-stretch gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                className="block border-b border-[var(--border-color)]/30 pb-3 font-secondary text-base text-txt-primary transition-colors hover:text-amarillo"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#reserva"
              onClick={closeMenu}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-amarillo px-4 py-3 font-secondary text-base text-negro transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-2"
            >
              Reservar ahora
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
          </li>
          <li className="flex justify-end border-t border-[var(--border-color)]/30 pt-4">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </>
  )
}
