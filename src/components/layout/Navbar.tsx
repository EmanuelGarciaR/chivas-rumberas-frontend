import Link from 'next/link'
import { ArrowUpRightIcon } from '@/components/icons'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export default function NavBar() {
  return (
    <header className="fixed left-0 top-0 z-[1000] flex h-[100px] w-full justify-between bg-transparent backdrop-blur-[12px]">
      <nav className="flex w-full items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center justify-start">
          <Link href="#" className="nav__logo-link">
            <img
              className="ml-[50px] h-[100px] w-[100px]"
              src="/icons/logo-chiva-ia.svg"
              alt="Logo Chivas Rumberas"
            />
          </Link>
          <h1 className="font-primary text-amarillo ml-5 text-xl font-bold capitalize">
            Chivas Rumberas La 80
          </h1>
        </div>

        {/* Hamburger Mobile - Visible solo en pantallas pequeñas */}
        <MobileMenu />

        {/* Menu - Oculto en móvil por defecto, visible en pantallas grandes (lg) */}
        <div className="mr-5 hidden items-center justify-center lg:flex">
          <ul className="flex list-none items-center justify-between gap-5">
            <li className="cursor-pointer text-base font-medium text-amarillo">
              <Link className="font-secondary text-amarillo no-underline transition-all duration-300 ease-in-out hover:text-blanco" href="#la-experiencia">
                La experiencia
              </Link>
            </li>
            <li className="cursor-pointer text-base font-medium text-amarillo">
              <Link className="font-secondary text-amarillo no-underline transition-all duration-300 ease-in-out hover:text-blanco" href="#nosotros">
                Nosotros
              </Link>
            </li>
            <li className="cursor-pointer text-base font-medium text-amarillo">
              <Link className="font-secondary text-amarillo no-underline transition-all duration-300 ease-in-out hover:text-blanco" href="#nuestras-chivas">
                Nuestras chivas
              </Link>
            </li>
            <li className="cursor-pointer text-base font-medium text-amarillo">
              <Link className="font-secondary text-amarillo no-underline transition-all duration-300 ease-in-out hover:text-blanco" href="#como-funciona">
                Cómo funciona
              </Link>
            </li>
            
            {/* Botón de Reserva usando tu componente base */}
            <li className="cursor-pointer text-base font-medium text-amarillo">
              <Link 
              href="#reserva" 
              className="font-secondary inline-flex h-10 items-center justify-center gap-2.5 rounded-lg border-none bg-amarillo px-2.5 text-base font-medium text-negro no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-2"
              >Reservar ahora <ArrowUpRightIcon size={18} />
              </Link>
            </li>

            {/* Toggle Modo Oscuro */}
            <li className="cursor-pointer text-base font-medium text-amarillo">
                <ThemeToggle />
            </li>
          </ul>
        </div>

      </nav>
    </header>
  )
}