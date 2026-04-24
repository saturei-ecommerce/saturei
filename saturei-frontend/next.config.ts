import type { NextConfig } from 'next'

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
const apiUrl = new URL(apiBase)

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        ...(apiUrl.port ? { port: apiUrl.port } : {}),
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig
