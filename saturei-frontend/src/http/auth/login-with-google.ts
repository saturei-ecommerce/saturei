interface LoginWithGoogleRequest {
  code: string
}

interface LoginWithGoogleResponse {
  token: string
}

export async function loginWithGoogle({
  code,
}: LoginWithGoogleRequest): Promise<LoginWithGoogleResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const response = {
    token: 'fake-google-token',
  }

  return response
}
