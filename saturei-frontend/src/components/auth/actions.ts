'use server'

import { redirect } from 'next/navigation'
import { env } from '@/env'
import { type LoginRequest, login } from '@/http/auth/login'
import { type RegisterRequest, register } from '@/http/auth/register'
import type { ActionResponse } from '@/interfaces/action-response'

export async function loginAction({
  email,
  password,
}: LoginRequest): Promise<ActionResponse> {
  try {
    const response = await login({ email, password })

    console.log('Login response:', response)
  } catch (error) {
    return {
      success: false,
      message: 'Login failed',
    }
  }

  return {
    success: true,
    message: 'Login successful',
  }
}

export async function registerAction({
  name,
  email,
  password,
}: RegisterRequest): Promise<ActionResponse> {
  try {
    await register({ name, email, password })
  } catch (error) {
    return {
      success: false,
      message: 'Register failed',
    }
  }

  return {
    success: true,
    message: 'Register successful',
  }
}

export async function loginWithGoogleAction() {
  const googleLoginUrl = new URL(
    'o/oauth2/v2/auth',
    'https://accounts.google.com',
  )

  googleLoginUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)
  googleLoginUrl.searchParams.set(
    'redirect_uri',
    `${env.NEXT_PUBLIC_WEB_BASE_URL}/auth/callback/google`,
  )
  googleLoginUrl.searchParams.set('scope', 'openid email profile')
  googleLoginUrl.searchParams.set('response_type', 'code')
  googleLoginUrl.searchParams.set('access_type', 'offline') // optional, for refresh token

  redirect(googleLoginUrl.toString())
}

export async function loginWithGithubAction() {
  const githubLoginUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubLoginUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
  githubLoginUrl.searchParams.set(
    'redirect_uri',
    `${env.NEXT_PUBLIC_WEB_BASE_URL}/auth/callback/github`,
  )
  githubLoginUrl.searchParams.set('scope', 'user:email')

  redirect(githubLoginUrl.toString())
}
