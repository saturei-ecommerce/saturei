import type { Metadata } from 'next'
import axios from 'axios'
import { notFound } from 'next/navigation'
import { fetchListingById } from '@/lib/api/listings'
import { ListingPageClient } from './ListingPageClient'

export const metadata: Metadata = {
  title: 'Detalhes do anúncio',
  description: 'Veja os detalhes do anúncio no Saturei.',
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  try {
    const listing = await fetchListingById(id)
    return <ListingPageClient listing={listing} />
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      notFound()
    }
    throw err
  }
}
