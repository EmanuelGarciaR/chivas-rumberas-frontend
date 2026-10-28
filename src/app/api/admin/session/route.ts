import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_COOKIE = 'admin_token'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export async function POST(request: NextRequest) {
  const credentials = await request.json().catch(() => null)
  if (
    !credentials ||
    typeof credentials.email !== 'string' ||
    typeof credentials.password !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Correo y contraseña son requeridos.' },
      { status: 400 },
    )
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_API_HOST ??
    'http://localhost:3000'

  let loginResponse: Response
  try {
    loginResponse = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'No fue posible contactar al servidor.' }, { status: 502 })
  }

  const loginBody = await loginResponse.json().catch(() => null)
  if (!loginResponse.ok || typeof loginBody?.accessToken !== 'string') {
    return NextResponse.json(
      loginBody ?? { error: 'Credenciales incorrectas.' },
      { status: loginResponse.status || 401 },
    )
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(TOKEN_COOKIE, loginBody.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(TOKEN_COOKIE)
  return response
}
