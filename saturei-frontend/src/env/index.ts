import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  NEXT_PUBLIC_WEB_BASE_URL: z.url(),
  NEXT_PUBLIC_API_BASE_URL: z.url(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
