import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Production: Render backend
      {
        protocol: 'https',
        hostname: 'saturei-backend.onrender.com',
        pathname: '/uploads/**',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig
