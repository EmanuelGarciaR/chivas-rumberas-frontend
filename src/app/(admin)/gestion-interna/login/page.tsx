'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LoginDto } from '@/lib/types'
import { login } from '@/lib/api/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [values, setValues] = useState<LoginDto>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { accessToken } = await login(values)
      // Store token in an HttpOnly cookie via a route handler
      await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      })
      router.push('/gestion-interna')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-txt-primary">Acceso administrativo</h1>
          <p className="mt-2 text-sm text-txt-secondary">
            Solo para el equipo de Chivas Rumberas La 80
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-2xl border border-borde bg-card p-6"
        >
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            autoComplete="email"
            required
            className="border-borde bg-secondary text-txt-primary placeholder:text-txt-secondary focus:ring-amarillo"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            className="border-borde bg-secondary text-txt-primary placeholder:text-txt-secondary focus:ring-amarillo"
          />

          {error ? (
            <p className="rounded-lg bg-crema-claro px-3 py-2 text-sm text-rojo">
              {error}
            </p>
          ) : null}

          <Button variant="primary" type="submit" size="lg" isLoading={isLoading} className="mt-2">
            Iniciar sesion
          </Button>
        </form>
      </div>
    </div>
  )
}
