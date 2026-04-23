'use server'

import type { ProductFormData } from '@/components/product/product-form'
import { createListing } from '@/http/product/create-listing'

interface CreateListingActionProps {
  data: Omit<ProductFormData, 'imageUrls'>
}

interface CreateListingActionResponse {
  listingId: string
}

export async function createListingAction({
  data,
}: CreateListingActionProps): Promise<CreateListingActionResponse> {
  try {
    const { listingId } = await createListing({ data })

    return { listingId }
  } catch (error) {
    console.error('Erro no createListing:', error)

    throw error
  }
}
