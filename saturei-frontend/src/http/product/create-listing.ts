import type { ProductFormData } from '@/components/product/product-form'
import { api } from '../api-client'

interface CreateListingRequest {
  data: Omit<ProductFormData, 'imageUrls'>
}

interface CreateListingResponse {
  listingId: string
}

export async function createListing({
  data,
}: CreateListingRequest): Promise<CreateListingResponse> {
  const response = await api
    .post('/listings', {
      json: {
        title: data.title,
        description: data.description,

        // ✅ CONVERSÃO IMPORTANTE
        price: Number(data.price),

        conservationState: data.conservationState,
        category: data.category,
        location: data.location,
      },
    })
    .json<CreateListingResponse>()

  return response
}
