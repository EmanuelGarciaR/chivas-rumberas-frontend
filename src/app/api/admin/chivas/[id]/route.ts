import { proxyAdminRequest } from '../../_lib/backend'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const body: unknown = await request.json().catch(() => null)
  return proxyAdminRequest(`/chivas/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  return proxyAdminRequest(`/chivas/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
