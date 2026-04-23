import {
  ProductForm,
  type ProductFormData,
} from "@/components/product/product-form";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";

type ListingResponse = {
  id: string;
};

async function createListing(
  data: Omit<ProductFormData, "imageUrls">,
): Promise<ListingResponse> {
  "use server";
  try {
    const response = await fetch(`${env.API_BASE_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,

        // ✅ CONVERSÃO IMPORTANTE
        price: Number(data.price),

        conservationState: data.conservationState,
        category: data.category,
        location: data.location,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Erro ao criar anúncio: ${response.status} - ${errorBody}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro no createListing:", error);
    throw error;
  }
}

export default function ProductPage() {
  return (
    <div className="flex items-center justify-center p-5">
      <div className="max-w-4xl w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">
            O que você vai <br />
            <span className="bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
              vender hoje?
            </span>
          </h1>
          <p className="text-foreground/60">
            preencha as informações abaixo e publique seu anúncio em menos de 2
            minutos.
          </p>
        </div>

        <Separator />

        {/* ✅ Fluxo correto:
            1. cria listing
            2. ProductForm faz upload das imagens */}
        <ProductForm onSubmit={createListing} />
      </div>
    </div>
  );
}
