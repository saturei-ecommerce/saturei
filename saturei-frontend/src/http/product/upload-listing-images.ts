import { api } from '../api-client'

interface UploadListingImagesRequest {
  listingId: string
  formData: FormData
}

export async function uploadListingImages({
  listingId,
  formData,
}: UploadListingImagesRequest) {
  const response = await api.post(`/listings/${listingId}/images`, {
    method: 'POST',
    body: formData,
  })

  return response
}
