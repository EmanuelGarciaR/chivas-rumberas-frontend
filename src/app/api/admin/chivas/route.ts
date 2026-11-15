import { proxyAdminRequest } from '../_lib/backend'

export async function GET() {
  return proxyAdminRequest('/chivas')
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  return proxyAdminRequest('/chivas', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
