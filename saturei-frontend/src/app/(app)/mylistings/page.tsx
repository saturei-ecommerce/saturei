"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MyListingCard } from "@/components/mylistings/MyListingCard";
import {
  deleteListing,
  getMyListings,
  type Listing,
  type ListingStatus,
  updateListingStatus,
} from "@/http/mylistings/my-listings";

// ─── Types ────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getMyListings();
        setListings(data);
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
      await deleteListing(id);
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
      await updateListingStatus(id, newStatus);

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
              <MyListingCard
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
              <MyListingCard
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
              <MyListingCard
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
