import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { BookingStatus } from '@/lib/types'

const validStatuses: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || !('status' in body)) {
    return NextResponse.json(
      { error: { type: 'ValidationError', message: 'El campo status es requerido.' } },
      { status: 400 },
    )
  }

  const nextStatus = body.status
  if (typeof nextStatus !== 'string' || !validStatuses.includes(nextStatus as BookingStatus)) {
    return NextResponse.json(
      { error: { type: 'ValidationError', message: 'El estado de la reserva no es válido.' } },
      { status: 400 },
    )
  }

  let totalPrice: number | undefined
  if ('totalPrice' in body && body.totalPrice !== undefined) {
    if (
      typeof body.totalPrice !== 'number' ||
      !Number.isFinite(body.totalPrice) ||
      body.totalPrice <= 0
    ) {
      return NextResponse.json(
        {
          error: {
            type: 'ValidationError',
            message: 'El precio final acordado debe ser un número mayor a 0.',
          },
        },
        { status: 400 },
      )
    }
    totalPrice = Math.round(body.totalPrice)
  }

  const { id } = await context.params
  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_HOST']
    const payload: { status: BookingStatus; totalPrice?: number } = {
      status: nextStatus as BookingStatus,
      ...(totalPrice !== undefined ? { totalPrice } : {}),
    }

    const response = await fetch(
      `${apiUrl}/bookings/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    )
    const responseBody: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json(
        responseBody ?? { error: { type: 'UnknownError', message: `HTTP ${response.status}` } },
        { status: response.status },
      )
    }
    return NextResponse.json(responseBody, { status: response.status })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { type: 'UpstreamError', message: error instanceof Error ? error.message : 'Error del servidor' } },
      { status: 502 },
    )
  }
}
