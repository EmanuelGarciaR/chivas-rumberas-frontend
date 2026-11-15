import type { Metadata } from 'next'
import { SeguimientoClient } from './_components/SeguimientoClient'

export const metadata: Metadata = {
  title: 'Seguir mi reserva | Chivas Rumberas La 80',
  description: 'Consulta el estado y los detalles de tu reserva de chiva rumbera.',
}

interface SeguimientoPageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function SeguimientoPage({ searchParams }: SeguimientoPageProps) {
  const { code } = await searchParams

  return (
    <main className="flex-1 bg-primary px-4 pb-20 pt-32 sm:px-6">
      <SeguimientoClient initialCode={code?.trim() ?? ''} />
    </main>
  )
}
