import { api } from "../api-client";

export type ListingStatus = "ACTIVE" | "PAUSED" | "SOLD";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  conservationState: "USED" | "NEW";
  category: string;
  location: string;
  status: ListingStatus;
  imageUrls: string[];
  createdAt: string;
  sellerId: string;
  sellerName: string;
}

interface PageResponse<T> {
  content: T[];
}

export async function getMyListings(): Promise<Listing[]> {
  try {
    const data = await api.get("listings/me").json<PageResponse<Listing>>();

    return data.content;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar anúncios");
  }
}

export async function deleteListing(id: string) {
  try {
    await api.delete(`listings/${id}`);
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao excluir anúncio");
  }
}

export async function updateListingStatus(id: string, status: ListingStatus) {
  try {
    await api.patch(`listings/${id}/status`, {
      json: { status },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar status");
  }
}
