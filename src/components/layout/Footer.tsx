import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRightIcon } from '@/components/icons'

export function Footer() {
  return (
    <footer className="bg-[var(--bg-dark-panel)] px-[50px] py-10 font-primary text-[var(--color-crema-claro)] sm:py-20">
      <section
        className="mb-12 flex flex-col items-center justify-between gap-10 sm:mb-20 lg:flex-row lg:gap-0"
        aria-label="Información principal"
      >
        <Link
          href="/"
          className="flex flex-1 items-center justify-center lg:justify-start"
          aria-label="Volver al inicio"
        >
          <Image
            src="/icons/logo-chiva-ia.svg"
            alt="Chivas Rumberas Logo"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <blockquote className="flex-1 text-center text-md leading-[1.2]">
          <p>
            La noche paisa,
            <br />
            <span className="font-secondary text-[1.2em] text-amarillo">
              sobre ruedas.
            </span>
          </p>
        </blockquote>

        <address className="flex flex-1 justify-center not-italic lg:justify-end">
          <a
            target="_blank"
            href="https://wa.me/573124797221?text=Hola,%20quiero%20más%20información%20sobre%20las%20chivas"
            className="flex items-center gap-2.5 border-b border-[rgba(240,203,65,0.3)] pb-1.5 text-sm text-amarillo no-underline transition-[border-color,opacity] duration-300 hover:border-amarillo hover:opacity-80"
          >
            WhatsApp
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </a>
        </address>
      </section>

      <section
        className="flex flex-col items-center justify-between gap-6 border-t border-[rgba(255,255,255,0.05)] pt-10 text-xs tracking-[1px] text-[var(--color-gris-claro)] lg:flex-row lg:gap-4"
        aria-label="Legal y redes sociales"
      >
        <small className="opacity-60">
          &copy; 2026 CHIVAS RUMBERAS LA  80- MEDELLÍN, CO
        </small>

        <nav aria-label="Redes sociales">
          <ul className="flex list-none items-center gap-[15px] p-0">
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/emanuelgarcia.r?stkn=MWp2eWl6YmI3bHh2Ng=="
                className="text-[var(--color-gris-claro)] no-underline transition-colors duration-300 hover:text-amarillo"
              >
                INSTAGRAM
              </a>
            </li>
            <li className="text-[rgba(255,255,255,0.2)]" aria-hidden="true">
              /
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.tiktok.com/@cristian.david.pa3?_r=1&_t=ZS-99hhaKCcaGL"
                className="text-[var(--color-gris-claro)] no-underline transition-colors duration-300 hover:text-amarillo"
              >
                TIKTOK
              </a>
            </li>
            <li className="text-[rgba(255,255,255,0.2)]" aria-hidden="true">
              /
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://wa.me/qr/YMPKXJTHKVSRK1"
                className="text-[var(--color-gris-claro)] no-underline transition-colors duration-300 hover:text-amarillo"
              >
                WHATSAPP
              </a>
            </li>
          </ul>
        </nav>

        <small className="opacity-60">HECHO EN MEDELLÍN</small>
      </section>
    </footer>
  )
}
