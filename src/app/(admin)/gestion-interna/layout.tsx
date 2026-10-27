import type { ReactNode } from 'react'
import { AdminNavbar } from './_components/AdminNavbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-primary text-txt-primary">
      <AdminNavbar />
      {children}
    </div>
  )
}
