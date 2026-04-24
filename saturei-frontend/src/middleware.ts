import { type NextRequest, NextResponse } from 'next/server'
import { getUrl } from '@/utils/get-url'

const publicRoutes = ['/', '/listing']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Logged-in user trying to access login/register → send to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(getUrl('/'), request.url))
  }

  // Unauthenticated user trying to access protected route → send to login
  if (!isPublicRoute && !isAuthRoute && !token) {
    return NextResponse.redirect(new URL(getUrl('/login'), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
