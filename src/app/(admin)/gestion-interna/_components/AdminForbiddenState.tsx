import Link from 'next/link'

interface AdminForbiddenStateProps {
  title?: string
  description?: string
  backHref?: string
  backLabel?: string
}

export function AdminForbiddenState({
  title = 'Sin permisos para consultar esta sección',
  description = 'Tu cuenta actual no tiene rol de administrador para ver o gestionar las reservas. Si necesitas acceso, solicita el cambio de rol al encargado del sistema.',
  backHref = '/gestion-interna/chivas',
  backLabel = 'Ir a gestión de chivas',
}: AdminForbiddenStateProps) {
  return (
    <div className="rounded-xl border border-borde bg-card p-8 text-center">
      <p className="font-secondary text-lg font-bold text-txt-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-txt-secondary">
        {description}
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href={backHref}
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-amarillo px-5 text-sm font-medium text-negro transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-2"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
