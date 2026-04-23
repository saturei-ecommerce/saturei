import type { Metadata } from 'next'
import { Merriweather, Roboto } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from './providers'

const merriweatherSerif = Merriweather({
  variable: '--font-serif',
  subsets: ['latin'],
})

const robotoSans = Roboto({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Saturei — Marketplace de Produtos',
    template: '%s | Saturei',
  },
  description:
    'Compre e venda produtos novos e usados com segurança no Saturei. O marketplace para quem quer fazer bons negócios.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${merriweatherSerif.variable} ${robotoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  )
}
