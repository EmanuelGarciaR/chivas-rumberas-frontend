import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { ChivaListItem } from '@/lib/types'
import { getChivas } from '@/lib/api/chivas'
import { ChivasAdminClient } from './_components/ChivasAdminClient'

export const metadata: Metadata = {
  title: 'Flota | Admin',
}

export default async function AdminChivasPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/gestion-interna/login')

  let chivas: ChivaListItem[] = []
  let error: string | null = null
  try {
    chivas = await getChivas(undefined, 0)
  } catch (reason: unknown) {
    error =
      reason instanceof Error
        ? reason.message
        : 'No fue posible cargar la flota de chivas.'
  }

  return <ChivasAdminClient chivas={chivas} error={error} />
}
