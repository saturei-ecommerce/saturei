import type { Metadata } from 'next'
import { SearchPageClientWrapper } from './SearchPageClient'

export const metadata: Metadata = {
  title: 'Saturei - Marketplace',
  description:
    'Pesquise anúncios no Saturei com filtros por palavra-chave, categoria, localização e faixa de preço. Encontre o melhor negócio.',
  openGraph: {
    title: 'Saturei - Marketplace',
    description:
      'Encontre produtos novos e usados no Saturei.',
    type: 'website',
  },
}

export default function SearchPage() {
  return <SearchPageClientWrapper />
}
