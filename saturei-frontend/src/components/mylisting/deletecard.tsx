import { Loader2, Trash2 } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { useState } from "react";

type ListingStatus = "ACTIVE" | "PAUSED" | "SOLD";

interface Listing {
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

function DeleteDialog({
  listing,
  onConfirm,
}: {
  listing: Listing;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          excluir anúncio
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          <div className="flex flex-col gap-2 mb-6">
            <AlertDialog.Title className="text-base font-semibold text-gray-900">
              excluir anúncio?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-500 leading-relaxed">
              o anúncio{" "}
              <span className="font-medium text-gray-700">
                "{listing.title}"
              </span>{" "}
              será removido permanentemente e não poderá ser recuperado.
            </AlertDialog.Description>
          </div>

          <div className="flex gap-2">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="flex-1 h-10 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-all"
              >
                cancelar
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                excluir
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export { DeleteDialog };
