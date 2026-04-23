'use server'

import { uploadListingImages } from '@/http/product/upload-listing-images'

export async function uploadFotosAction(
  listingId: string,
  formData: FormData,
): Promise<Response> {
  const response = await uploadListingImages({ listingId, formData })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `Erro ao fazer upload das imagens: ${response.status} - ${errorBody}`,
    )
  }

  return response.json()
}
