import { api } from '../api-client'

export interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export async function login({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  const response = await api
    .post('/auth/login', {
      json: {
        email,
        password,
      },
    })
    .json<LoginResponse>()

  return response
}
