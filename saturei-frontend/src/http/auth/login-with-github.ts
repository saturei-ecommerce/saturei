interface LoginWithGithubRequest {
  code: string
}

interface LoginWithGithubResponse {
  token: string
}

export async function loginWithGithub({
  code,
}: LoginWithGithubRequest): Promise<LoginWithGithubResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const response = {
    token: 'fake-github-token',
  }

  return response
}
