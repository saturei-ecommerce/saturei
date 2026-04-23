'use client'

import {
  ArrowLeft,
  MessageCircle,
  Package,
  Search,
  Send,
  Wifi,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { Conversation } from '@/hooks/useChat'
import { useChat } from '@/hooks/useChat'

export function ChatPageClientWrapper() {
  return (
    <Suspense fallback={null}>
      <ChatPageClient />
    </Suspense>
  )
}

function ChatPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlListingId = searchParams.get('listingId')
  const urlSellerId = searchParams.get('sellerId')
  const urlSellerName = searchParams.get('sellerName') ?? 'Vendedor'
  const urlListingTitle = searchParams.get('listingTitle') ?? 'Anúncio'

  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const {
    conversations,
    messages,
    connected,
    demoMode,
    sendMessage,
    startConversation,
  } = useChat({ conversationId: activeConvId })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: no problem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // biome-ignore lint/correctness/useExhaustiveDependencies: no problem
  useEffect(() => {
    if (urlListingId && urlSellerId) {
      const id = startConversation(
        urlListingId,
        urlListingTitle,
        urlSellerId,
        urlSellerName,
      )
      setActiveConvId(id)
      setMobileShowChat(true)
    }
  }, [urlListingId, urlSellerId])

  const activeConv = conversations.find((c) => c.id === activeConvId)

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage(inputValue)
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectConversation = (conv: Conversation) => {
    setActiveConvId(conv.id)
    setMobileShowChat(true)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={`
          flex flex-col w-full max-w-sm border-r border-border bg-card flex-shrink-0
          ${mobileShowChat ? 'hidden lg:flex' : 'flex'}
          lg:flex
        `}
        style={{ minWidth: 0 }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-border"
          style={{
            background:
              'linear-gradient(135deg, oklch(55.8% 0.288 302.321) 0%, oklch(50% 0.25 302.321) 100%)',
          }}
        >
          <Link
            href="/search"
            id="chat-back-to-search"
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            aria-label="Voltar para busca"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-white font-bold text-base tracking-tight">
              Saturei
            </span>
          </div>
          <span className="text-white/70 text-sm font-medium">Mensagens</span>
        </div>

        {connected && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border-b border-border">
            <Wifi size={12} className="text-primary" />
            <span className="text-[11px] text-primary font-medium">
              Conectado em tempo real
            </span>
          </div>
        )}

        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="chat-search-input"
              type="text"
              placeholder="Buscar conversa…"
              className="
                w-full pl-8 pr-3 py-2 rounded-xl text-sm bg-muted border border-border
                focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all
                text-foreground placeholder:text-muted-foreground
              "
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <MessageCircle size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhuma conversa ainda.
                <br />
                Contate um vendedor pela busca.
              </p>
              <Link
                href="/search"
                id="chat-go-to-search"
                className="text-primary text-sm font-semibold hover:underline"
              >
                Explorar anúncios →
              </Link>
            </div>
          ) : (
            <ul className="py-2 px-2 flex flex-col gap-1">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeConvId}
                  onClick={() => selectConversation(conv)}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>

      <main
        className={`
          flex-1 flex flex-col min-w-0
          ${mobileShowChat ? 'flex' : 'hidden lg:flex'}
        `}
      >
        {activeConv ? (
          <>
            <header className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-card shadow-sm flex-shrink-0">
              <button
                type="button"
                id="chat-mobile-back"
                onClick={() => setMobileShowChat(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">
                  {activeConv.sellerName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">
                  {activeConv.sellerName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activeConv.listingTitle}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connected ? 'bg-green-500' : 'bg-muted-foreground/40'
                  }`}
                />
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {connected ? 'Online' : 'Offline'}
                </span>
              </div>
            </header>

            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-secondary/40 border-b border-border flex-shrink-0">
              <Package size={14} className="text-primary flex-shrink-0" />
              <span className="text-xs text-foreground/80 truncate font-medium">
                {activeConv.listingTitle}
              </span>
              <Link
                href={`/listings/${activeConv.listingId}`}
                id="chat-view-listing"
                className="ml-auto text-xs text-primary hover:underline font-semibold whitespace-nowrap"
              >
                Ver anúncio
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle size={28} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Inicie a conversa! Pergunte sobre disponibilidade, preço ou
                    condição do produto.
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-end gap-3 px-4 py-4 border-t border-border bg-card flex-shrink-0">
              <input
                ref={inputRef}
                id="chat-message-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva uma mensagem…"
                className="
                  flex-1 px-4 py-3 rounded-2xl border border-border bg-muted text-sm
                  text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40
                  transition-all resize-none
                "
                maxLength={1000}
                autoComplete="off"
              />
              <button
                id="chat-send-button"
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="
                  w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                  bg-primary text-primary-foreground
                  hover:opacity-90 active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-150 shadow-md
                "
                aria-label="Enviar mensagem"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation
  isActive: boolean
  onClick: () => void
}) {
  const timeLabel = conv.lastMessageAt ? formatTimeAgo(conv.lastMessageAt) : ''

  return (
    <li>
      <button
        type="button"
        id={`conv-item-${conv.id}`}
        onClick={onClick}
        className={`
          w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150
          ${
            isActive
              ? 'bg-primary/10 border border-primary/20'
              : 'hover:bg-muted border border-transparent hover:border-border'
          }
        `}
      >
        <div
          className={`
            w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
            ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
          `}
        >
          {conv.sellerName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span
              className={`text-sm font-semibold truncate ${
                isActive ? 'text-primary' : 'text-foreground'
              }`}
            >
              {conv.sellerName}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
              {timeLabel}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mb-0.5">
            {conv.listingTitle}
          </p>
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs text-muted-foreground/80 truncate">
              {conv.lastMessage ?? 'Iniciar conversa'}
            </p>
            {conv.unreadCount > 0 && (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {conv.unreadCount}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  )
}

function MessageBubble({
  message,
}: {
  message: {
    content: string
    senderName: string
    sentAt: string
    isOwn: boolean
  }
}) {
  const time = new Date(message.sentAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}
    >
      {!message.isOwn && (
        <span className="text-[10px] text-muted-foreground mb-1 ml-1">
          {message.senderName}
        </span>
      )}
      <div
        className={`
          max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${
            message.isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border text-foreground rounded-bl-sm'
          }
        `}
      >
        {message.content}
      </div>
      <span
        className={`text-[10px] text-muted-foreground mt-1 ${message.isOwn ? 'mr-1' : 'ml-1'}`}
      >
        {time}
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center p-8">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle, oklch(92% 0.04 302.321) 0%, oklch(97% 0.01 302.321) 100%)',
        }}
      >
        <MessageCircle size={36} className="text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          Suas Mensagens
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Selecione uma conversa ao lado ou encontre um produto e clique em{' '}
          <strong className="text-primary">Contatar Vendedor</strong>.
        </p>
      </div>
      <Link
        href="/search"
        id="chat-empty-go-to-search"
        className="
          inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-primary text-primary-foreground text-sm font-semibold
          hover:opacity-90 active:scale-95 transition-all shadow-md
        "
      >
        <Search size={16} />
        Explorar anúncios
      </Link>
    </div>
  )
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min`
  if (h < 24) return `${h}h`
  return `${d}d`
}
