import { proxyAdminRequest } from '../../../_lib/backend'

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  return proxyAdminRequest(`/bookings/${encodeURIComponent(id)}/calendar-sync`, {
    method: 'POST',
  })
}
