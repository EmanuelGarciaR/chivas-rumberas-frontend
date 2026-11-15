import type { NextRequest } from 'next/server'
import { proxyAdminRequest } from '../_lib/backend'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString()
  return proxyAdminRequest(`/bookings${query ? `?${query}` : ''}`)
}
