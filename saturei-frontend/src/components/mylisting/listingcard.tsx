import { Edit, EllipsisVertical, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";
import { DeleteDialog } from "./deletecard";
import { StatusBadge } from "./statusbadge";

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

function ListingCard({
  listing,
  onDelete,
  onToggleStatus,
}: {
  listing: Listing;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, status: ListingStatus) => Promise<void>;
}) {
  const isPaused = listing.status === "PAUSED";
  const isSold = listing.status === "SOLD";
  const coverImage = listing.imageUrls[0];

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      {/* Imagem */}
      <div className="relative size-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={listing.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            sem foto
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {listing.title}
          </p>
          <StatusBadge status={listing.status} />
        </div>

        <p className="text-xs text-gray-400 truncate">
          {listing.category} · {listing.location}
        </p>

        <p className="text-sm font-semibold text-primary">
          R$ {Number(listing.price).toFixed(2).replace(".", ",")}
        </p>
      </div>

      {/* Actions */}
      {!isSold && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="shrink-0 size-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <EllipsisVertical size={16} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 w-48 bg-white rounded-xl border border-gray-100 shadow-lg p-1.5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150"
            >
              <DropdownMenu.Item asChild>
                <Link
                  href={`/my-listings/${listing.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer outline-none"
                >
                  <Edit size={14} className="text-gray-400" />
                  editar anúncio
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  onClick={() => onToggleStatus(listing.id, listing.status)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors outline-none"
                >
                  {isPaused ? (
                    <>
                      <Play size={14} className="text-gray-400" />
                      reativar anúncio
                    </>
                  ) : (
                    <>
                      <Pause size={14} className="text-gray-400" />
                      pausar anúncio
                    </>
                  )}
                </button>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />

              <DeleteDialog
                listing={listing}
                onConfirm={() => onDelete(listing.id)}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}

export { ListingCard };
