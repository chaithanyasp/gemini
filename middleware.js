import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/chat')) {
    const cookie = request.cookies.get('kuvaka_auth')
    if (!cookie || cookie.value !== 'true') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/chat/:path*'] }
