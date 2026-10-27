import { proxyAdminRequest } from '../../_lib/backend'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  return proxyAdminRequest(`/bookings/${encodeURIComponent(id)}`)
}
