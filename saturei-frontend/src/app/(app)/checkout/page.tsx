import type { Metadata } from 'next'
import { CheckoutPageClient } from './CheckoutPageClient'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Finalize sua compra no Saturei.',
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
