"use server";

import { uploadListingImages } from "@/http/product/upload-listing-images";

export async function uploadFotosAction(id: string, formData: FormData) {
  const data = await uploadListingImages({ id, formData });

  return data;
}
