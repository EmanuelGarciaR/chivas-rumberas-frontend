import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reserva confirmada | Chivas Rumberas',
}

interface ConfirmacionPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const { id } = await searchParams
  const trackHref = id
    ? `/seguimiento?code=${encodeURIComponent(id)}`
    : '/seguimiento'

  return (
    <div className="flex flex-1 items-center justify-center bg-primary px-4 pb-20 pt-32">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amarillo">
          <svg
            className="h-8 w-8 text-negro"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-primary text-2xl font-bold text-txt-primary">Solicitud recibida</h1>
        <p className="mt-3 font-primary text-txt-secondary">
          Hemos recibido tu solicitud de reserva. Nuestro equipo se pondrá en contacto
          contigo para confirmar los detalles y el precio final.
        </p>

        {id ? (
          <div className="mt-6 rounded-xl border border-amarillo bg-card px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-txt-secondary">
              Código de reserva
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wide text-txt-primary">
              {id}
            </p>
            <p className="mt-1 text-xs text-txt-secondary">
              Guarda este código para consultar el estado de tu reserva.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={trackHref}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-amarillo text-sm font-semibold text-negro transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-2"
          >
            Seguir mi reserva
          </Link>
          <Link
            href="/"
            className="flex h-10 w-full items-center justify-center rounded-lg bg-rojo text-sm font-medium text-crema-claro transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Volver al inicio
          </Link>
          <Link
            href="/#nuestras-chivas"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-borde bg-card text-sm font-medium text-txt-primary transition-colors hover:border-amarillo hover:text-rojo"
          >
            Ver otras chivas
          </Link>
        </div>
      </div>
    </div>
  )
}
