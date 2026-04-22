import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  image?: string
  quantity: number
}

interface CartState {
  items: CartItem[]

  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void

  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const q = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1
        set((state) => {
          const existing = state.items.find((it) => it.id === item.id)
          if (!existing) {
            return { items: [...state.items, { ...item, quantity: q }] }
          }
          return {
            items: state.items.map((it) =>
              it.id === item.id ? { ...it, quantity: it.quantity + q } : it,
            ),
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((it) => it.id !== id) }))
      },

      setQuantity: (id, quantity) => {
        const q = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, quantity: q } : it,
          ),
        }))
      },

      clear: () => set({ items: [] }),

      totalPrice: () =>
        get().items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    }),
    {
      name: 'saturei-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
