"use server";

import type { ProductFormData } from "@/components/product/product-form";
import { createListing } from "@/http/product/create-listing";
import { uploadListingImages } from "@/http/product/upload-listing-images";

interface CreateListingActionProps {
  data: Omit<ProductFormData, "imageUrls">;
}

interface CreateListingActionResponse {
  listingId: string;
}

export async function createListingAction({
  data,
}: CreateListingActionProps): Promise<CreateListingActionResponse> {
  try {
    const { id } = await createListing({ data });

    return { listingId: id };
  } catch (error) {
    console.error("Erro no createListing:", error);

    throw error;
  }
}
export async function uploadFotosAction(id: string, formData: FormData) {
  return uploadListingImages({ id, formData });
}
