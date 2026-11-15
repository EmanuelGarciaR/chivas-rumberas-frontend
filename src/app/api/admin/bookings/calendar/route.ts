import type { NextRequest } from 'next/server'
import { proxyAdminRequest } from '../../_lib/backend'

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month') ?? ''
  return proxyAdminRequest(
    `/bookings/calendar?month=${encodeURIComponent(month)}`,
  )
}
