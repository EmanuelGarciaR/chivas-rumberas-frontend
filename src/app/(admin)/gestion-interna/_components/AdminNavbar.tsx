'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LogoutButton } from './LogoutButton'

const links = [
  { href: '/gestion-interna', label: 'Dashboard', exact: true },
  { href: '/gestion-interna/reservas', label: 'Reservas', exact: false },
  { href: '/gestion-interna/chivas', label: 'Chivas', exact: false },
]

export function AdminNavbar() {
  const pathname = usePathname()

  if (pathname === '/gestion-interna/login') return null

  return (
    <nav
      aria-label="Navegación administrativa"
      className="relative z-[1000] flex h-[100px] w-full justify-between bg-transparent backdrop-blur-[12px]"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start">
          <Link href="/gestion-interna" className="nav__logo-link">
            <Image
              className="ml-[50px] h-[100px] w-[100px]"
              src="/icons/logo-chiva-ia.svg"
              alt="Logo Chivas Rumberas"
              width={100}
              height={100}
            />
          </Link>
          <h1 className="ml-5 font-primary text-xl font-bold capitalize text-rojo">
            Chivas Rumberas La 80
          </h1>
        </div>

        <div className="mr-5 flex items-center justify-center">
          <ul className="flex list-none items-center justify-between gap-5">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className="font-secondary text-rojo no-underline transition-all duration-300 ease-in-out hover:text-negro"
              >
                {link.label}
              </Link>
            )
          })}
          <LogoutButton />
          </ul>
        </div>
      </div>
    </nav>
  )
}
