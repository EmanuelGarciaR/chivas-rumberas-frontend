import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { ChivaStatus } from '@/lib/types'

const validStatuses: ChivaStatus[] = ['available', 'maintenance', 'retired']

function isChivaStatus(value: unknown): value is ChivaStatus {
  return typeof value === 'string' && validStatuses.includes(value as ChivaStatus)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || !('status' in body)) {
    return NextResponse.json(
      {
        error: {
          type: 'ValidationError',
          message: 'El campo status es requerido.',
        },
      },
      { status: 400 },
    )
  }

  const status = body.status
  if (!isChivaStatus(status)) {
    return NextResponse.json(
      {
        error: {
          type: 'ValidationError',
          message: 'El estado de la chiva no es válido.',
        },
      },
      { status: 400 },
    )
  }

  const { id } = await context.params
  try {
    const apiUrl =
      process.env.API_URL ?? 'http://localhost:3000'
    const response = await fetch(
      `${apiUrl}/chivas/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        cache: 'no-store',
      },
    )

    const responseBody: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json(responseBody ?? {
        error: {
          type: 'UnknownError',
          message: `HTTP ${response.status}`,
        },
      }, { status: response.status })
    }

    return NextResponse.json(responseBody, { status: response.status })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          type: 'UpstreamError',
          message: error instanceof Error ? error.message : 'Error del servidor',
        },
      },
      { status: 502 },
    )
  }
}
