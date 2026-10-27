'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' })
    router.push('/gestion-interna/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="font-secondary text-rojo no-underline transition-all duration-300 ease-in-out hover:text-negro"
    >
      Cerrar sesion
    </button>
  )
}
