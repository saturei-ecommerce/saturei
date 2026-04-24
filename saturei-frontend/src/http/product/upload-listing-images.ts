import { api } from "../api-client";

interface UploadListingImagesRequest {
  id: string;
  formData: FormData;
}

export async function uploadListingImages({
  id,
  formData,
}: UploadListingImagesRequest): Promise<string[]> {
  return api
    .post(`/listings/${id}/images`, {
      body: formData,
    })
    .json<string[]>();
}
