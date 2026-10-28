import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function proxyAdminRequest(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) {
    return NextResponse.json(
      { error: { type: 'UnauthorizedError', message: 'Sesión no autenticada.' } },
      { status: 401 },
    )
  }

  const backendUrl = process.env['NEXT_PUBLIC_API_HOST']

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...init.headers,
      },
      cache: 'no-store',
    })
    const body = await response.json().catch(() => null)
    return NextResponse.json(body, { status: response.status })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          type: 'UpstreamError',
          message: error instanceof Error ? error.message : 'Error del servidor.',
        },
      },
      { status: 502 },
    )
  }
}
