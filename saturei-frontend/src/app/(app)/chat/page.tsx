import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ChatPageClientWrapper } from '@/app/(app)/chat/ChatPageClient'

export const metadata: Metadata = {
  title: 'Mensagens',
  description: 'Converse com compradores e vendedores no Saturei.',
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatPageClientWrapper />
    </Suspense>
  )
}

function ChatPageSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="h-16 skeleton" />
        <div className="flex-1 p-3 flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no problem
            <div key={i} className="h-20 skeleton rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 skeleton border-b border-border" />
        <div className="flex-1" />
        <div className="h-20 skeleton border-t border-border" />
      </div>
    </div>
  )
}
