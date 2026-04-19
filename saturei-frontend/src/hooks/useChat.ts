'use client'

import { Client } from '@stomp/stompjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'

const WS_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/ws`
  : 'http://localhost:8080/ws'

// ─── Types ────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  sentAt: string
  isOwn: boolean
}

export interface Conversation {
  id: string
  listingId: string
  listingTitle: string
  listingImage?: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
}

// ─── Demo seed data ───────────────────────────────────────────

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    listingId: 'l-1',
    listingTitle: 'MacBook Pro M3 — Como novo',
    buyerId: 'buyer-1',
    buyerName: 'Você',
    sellerId: 'seller-1',
    sellerName: 'Carlos Mendes',
    lastMessage: 'Ainda está disponível?',
    lastMessageAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    listingId: 'l-2',
    listingTitle: 'Mesa de Escritório Pé de Ferro',
    buyerId: 'buyer-1',
    buyerName: 'Você',
    sellerId: 'seller-2',
    sellerName: 'Ana Paula',
    lastMessage: 'Pode fazer R$ 350?',
    lastMessageAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'conv-3',
    listingId: 'l-3',
    listingTitle: 'iPhone 15 Pro 256GB',
    buyerId: 'buyer-1',
    buyerName: 'Você',
    sellerId: 'seller-3',
    sellerName: 'Rafael Lima',
    lastMessage: 'Pode sim, vamos combinar!',
    lastMessageAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    unreadCount: 0,
  },
]

const DEMO_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversationId: 'conv-1',
      senderId: 'seller-1',
      senderName: 'Carlos Mendes',
      content: 'Olá! Vi que você se interessou pelo meu MacBook Pro. Posso ajudar?',
      sentAt: new Date(Date.now() - 10 * 60_000).toISOString(),
      isOwn: false,
    },
    {
      id: 'm-2',
      conversationId: 'conv-1',
      senderId: 'buyer-1',
      senderName: 'Você',
      content: 'Ainda está disponível?',
      sentAt: new Date(Date.now() - 5 * 60_000).toISOString(),
      isOwn: true,
    },
  ],
  'conv-2': [
    {
      id: 'm-3',
      conversationId: 'conv-2',
      senderId: 'buyer-1',
      senderName: 'Você',
      content: 'Bom dia! A mesa ainda está disponível?',
      sentAt: new Date(Date.now() - 3 * 3_600_000).toISOString(),
      isOwn: true,
    },
    {
      id: 'm-4',
      conversationId: 'conv-2',
      senderId: 'seller-2',
      senderName: 'Ana Paula',
      content: 'Sim! Está em perfeito estado.',
      sentAt: new Date(Date.now() - 2.5 * 3_600_000).toISOString(),
      isOwn: false,
    },
    {
      id: 'm-5',
      conversationId: 'conv-2',
      senderId: 'buyer-1',
      senderName: 'Você',
      content: 'Pode fazer R$ 350?',
      sentAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
      isOwn: true,
    },
  ],
  'conv-3': [
    {
      id: 'm-6',
      conversationId: 'conv-3',
      senderId: 'buyer-1',
      senderName: 'Você',
      content: 'Olá, aceita troca por iPhone 14?',
      sentAt: new Date(Date.now() - 25 * 3_600_000).toISOString(),
      isOwn: true,
    },
    {
      id: 'm-7',
      conversationId: 'conv-3',
      senderId: 'seller-3',
      senderName: 'Rafael Lima',
      content: 'Pode sim, vamos combinar!',
      sentAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
      isOwn: false,
    },
  ],
}

// ─── Hook ─────────────────────────────────────────────────────

interface UseChatOptions {
  conversationId: string | null
  /** JWT token — will be sent in STOMP header when available */
  token?: string
}

export function useChat({ conversationId, token }: UseChatOptions) {
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const [demoMode, setDemoMode] = useState(true)

  const clientRef = useRef<Client | null>(null)
  const mountedRef = useRef(true)

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }
    // Seed with demo data
    setMessages(DEMO_MESSAGES[conversationId] ?? [])
    // Mark as read
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    )
  }, [conversationId])

  // STOMP WebSocket connection lifecycle
  useEffect(() => {
    mountedRef.current = true

    // Only attempt connection when we have a conversation
    if (!conversationId) return

    let client: Client | null = null

    try {
      client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        reconnectDelay: 0, // no auto-reconnect — avoid freezes
        onConnect: () => {
          if (!mountedRef.current) return
          setConnected(true)
          setDemoMode(false)

          // Subscribe to this conversation's topic
          client?.subscribe(
            `/topic/conversation.${conversationId}`,
            (frame) => {
              if (!mountedRef.current) return
              try {
                const msg = JSON.parse(frame.body) as ChatMessage
                setMessages((prev) => [...prev, { ...msg, isOwn: false }])
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === conversationId
                      ? {
                          ...c,
                          lastMessage: msg.content,
                          lastMessageAt: msg.sentAt,
                        }
                      : c,
                  ),
                )
              } catch {
                // malformed frame — ignore
              }
            },
          )
        },
        onDisconnect: () => {
          if (mountedRef.current) {
            setConnected(false)
            setDemoMode(true)
          }
        },
        onStompError: () => {
          if (mountedRef.current) {
            setConnected(false)
            setDemoMode(true)
          }
        },
        onWebSocketError: () => {
          if (mountedRef.current) {
            setConnected(false)
            setDemoMode(true)
          }
        },
      })

      clientRef.current = client
      client.activate()
    } catch {
      // Connection failed — stay in demo mode
      setDemoMode(true)
    }

    return () => {
      mountedRef.current = false
      if (client?.active) {
        client.deactivate()
      }
      clientRef.current = null
    }
  }, [conversationId, token])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // ─── Actions ────────────────────────────────────────────────

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !conversationId) return

      const optimistic: ChatMessage = {
        id: `local-${Date.now()}`,
        conversationId,
        senderId: 'buyer-1',
        senderName: 'Você',
        content: content.trim(),
        sentAt: new Date().toISOString(),
        isOwn: true,
      }

      // Optimistic update
      setMessages((prev) => [...prev, optimistic])
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: content.trim(),
                lastMessageAt: optimistic.sentAt,
              }
            : c,
        ),
      )

      // Send via STOMP if connected
      if (clientRef.current?.active && !demoMode) {
        clientRef.current.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify({
            conversationId,
            content: content.trim(),
          }),
        })
      }
    },
    [conversationId, demoMode],
  )

  const startConversation = useCallback(
    (listingId: string, listingTitle: string, sellerId: string, sellerName: string) => {
      // Check if conversation already exists
      const existing = conversations.find(
        (c) => c.listingId === listingId && c.sellerId === sellerId,
      )
      if (existing) return existing.id

      // Generate a deterministic ID instead of Date.now() to prevent duplicate key errors
      // if React Strict Mode runs the effect twice.
      const newId = `conv-${listingId}-${sellerId}`

      // Create a new demo conversation
      const newConv: Conversation = {
        id: newId,
        listingId,
        listingTitle,
        buyerId: 'buyer-1',
        buyerName: 'Você',
        sellerId,
        sellerName,
        unreadCount: 0,
      }
      
      setConversations((prev) => {
        // Double check in functional updater for React Strict Mode safety
        if (prev.some(c => c.listingId === listingId && c.sellerId === sellerId)) {
          return prev
        }
        return [newConv, ...prev]
      })
      return newId
    },
    [conversations],
  )

  return {
    conversations,
    messages,
    connected,
    demoMode,
    sendMessage,
    startConversation,
  }
}
