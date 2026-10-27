import { proxyAdminRequest } from '../_lib/backend'

export async function GET() {
  return proxyAdminRequest('/bookings')
}
