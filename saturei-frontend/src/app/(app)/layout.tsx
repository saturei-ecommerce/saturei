import type { PropsWithChildren } from 'react'
import Navbar from '@/components/ui/navbar'

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
    </div>
  )
}
