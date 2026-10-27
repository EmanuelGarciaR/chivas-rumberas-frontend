import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PREFIX = '/gestion-interna'
const LOGIN_PATH = '/gestion-interna/login'
const TOKEN_COOKIE = 'admin_token'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard the admin section
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next()
  }

  // Allow the login page through
  if (pathname === LOGIN_PATH) {
    return NextResponse.next()
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/gestion-interna/:path*',
}
