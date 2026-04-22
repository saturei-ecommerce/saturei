import type { Metadata } from 'next'
import { CartPageClient } from './CartPageClient'

export const metadata: Metadata = {
  title: 'Carrinho',
  description: 'Veja os itens do seu carrinho no Saturei.',
}

export default function CartPage() {
  return <CartPageClient />
}
