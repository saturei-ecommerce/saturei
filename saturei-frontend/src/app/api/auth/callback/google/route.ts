import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { loginWithGoogle } from '@/http/auth/login-with-google'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'Google OAuth code was not found.',
      },
      {
        status: 400,
      },
    )
  }

  const { token } = await loginWithGoogle({ code })

  const cookieStore = await cookies()

  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'

  return NextResponse.redirect(redirectUrl)
}
