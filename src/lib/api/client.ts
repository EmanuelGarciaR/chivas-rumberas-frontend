const NEXT_PUBLIC_API_HOST =
  process.env.NEXT_PUBLIC_API_HOST ??
  'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    public status: number,
    public type: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends RequestInit {
  tags?: string[]
  revalidate?: number | false
}

export async function apiFetch<T>(
  path: string,
  { tags, revalidate, ...init }: FetchOptions = {},
): Promise<T> {
  const url = `${NEXT_PUBLIC_API_HOST}${path}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
    ...init,
  })

  if (!res.ok) {
    console.error(`API request failed: ${res.status} ${res.statusText} - ${url}`)
    let type = 'UnknownError'
    let message = `HTTP ${res.status}`

    try {
      const body = await res.json()
      // Standard error format: { error: { type, message } }
      if (body?.error?.message) {
        message = body.error.message
        type = body.error.type ?? type
      } else if (body?.message) {
        message = body.message
      }
    } catch {
      // ignore parse error
    }

    throw new ApiError(res.status, type, message)
  }

  return res.json() as Promise<T>
}
