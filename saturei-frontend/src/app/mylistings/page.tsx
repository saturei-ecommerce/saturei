"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Edit,
  EllipsisVertical,
  Loader2,
  Pause,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ListingStatus = "ACTIVE" | "PAUSED" | "SOLD";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  conservationState: "USADO" | "NOVO";
  category: string;
  location: string;
  status: ListingStatus;
  imageUrls: string[];
  createdAt: string;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ListingStatus }) {
  const styles: Record<ListingStatus, string> = {
    ACTIVE: "bg-green-50 text-green-600 border-green-100",
    PAUSED: "bg-yellow-50 text-yellow-600 border-yellow-100",
    SOLD: "bg-gray-50 text-gray-500 border-gray-100",
  };

  const labels: Record<ListingStatus, string> = {
    ACTIVE: "ativo",
    PAUSED: "pausado",
    SOLD: "vendido",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

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

// ─── Listing Card ─────────────────────────────────────────────────────────────

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

// ─── MyListingsPage ───────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/me`,
        );
        if (!response.ok) throw new Error("Erro ao buscar anúncios");
        const data = await response.json();
        setListings(data.content ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Erro ao excluir");
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: ListingStatus,
  ) => {
    const newStatus = currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (!response.ok) throw new Error("Erro ao atualizar status");
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const active = listings.filter((l) => l.status === "ACTIVE");
  const paused = listings.filter((l) => l.status === "PAUSED");
  const sold = listings.filter((l) => l.status === "SOLD");

  return (
    <div className="flex items-start justify-center p-5">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              meus anúncios
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {listings.length} anúncio{listings.length !== 1 ? "s" : ""} no
              total
            </p>
          </div>
          <Link
            href="/product"
            className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all"
          >
            <Plus size={15} />
            novo anúncio
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty */}
        {!loading && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="size-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              nenhum anúncio ainda
            </p>
            <p className="text-sm text-muted-foreground">
              publique seu primeiro anúncio e comece a vender
            </p>
            <Link
              href="/product"
              className="mt-2 flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all"
            >
              <Plus size={15} />
              criar anúncio
            </Link>
          </div>
        )}

        {/* Ativos */}
        {active.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              ativos · {active.length}
            </p>
            {active.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </section>
        )}

        {/* Pausados */}
        {paused.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              pausados · {paused.length}
            </p>
            {paused.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </section>
        )}

        {/* Vendidos */}
        {sold.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              vendidos · {sold.length}
            </p>
            {sold.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
