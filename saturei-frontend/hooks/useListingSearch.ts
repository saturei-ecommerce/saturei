"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type SearchParams,
  fetchCategories,
  fetchLocations,
  searchListings,
} from "@/lib/api/listings";

const DEBOUNCE_MS = 350;

// ─── URL ↔ State helpers ──────────────────────────────────────

function paramsToSearch(sp: URLSearchParams): SearchParams {
  return {
    keyword: sp.get("keyword") ?? undefined,
    category: sp.get("category") ?? undefined,
    location: sp.get("location") ?? undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    page: sp.get("page") ? Number(sp.get("page")) : 0,
    size: 12,
    sort: "createdAt,desc",
  };
}

function searchToParams(s: SearchParams): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.keyword) sp.set("keyword", s.keyword);
  if (s.category) sp.set("category", s.category);
  if (s.location) sp.set("location", s.location);
  if (s.minPrice != null) sp.set("minPrice", String(s.minPrice));
  if (s.maxPrice != null) sp.set("maxPrice", String(s.maxPrice));
  if (s.page && s.page > 0) sp.set("page", String(s.page));
  return sp;
}

// ─── Hook ─────────────────────────────────────────────────────

export function useListingSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local filter state (driven from URL)
  const [filters, setFilters] = useState<SearchParams>(() =>
    paramsToSearch(searchParams)
  );

  // Debounced filters used for the actual API call
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce keyword and price changes
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [filters]);

  // Push URL whenever debounced filters change
  useEffect(() => {
    const sp = searchToParams(debouncedFilters);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]);

  // ─── Actions ──────────────────────────────────────────────

  const setKeyword = useCallback((keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword: keyword || undefined, page: 0 }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
      page: 0,
    }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({
      ...prev,
      location: location || undefined,
      page: 0,
    }));
  }, []);

  const setMinPrice = useCallback((min: number | undefined) => {
    setFilters((prev) => ({ ...prev, minPrice: min, page: 0 }));
  }, []);

  const setMaxPrice = useCallback((max: number | undefined) => {
    setFilters((prev) => ({ ...prev, maxPrice: max, page: 0 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setDebouncedFilters((prev) => ({ ...prev, page })); // immediate
  }, []);

  const clearFilters = useCallback(() => {
    const empty: SearchParams = { page: 0, size: 12, sort: "createdAt,desc" };
    setFilters(empty);
    setDebouncedFilters(empty);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.keyword ||
          filters.category ||
          filters.location ||
          filters.minPrice != null ||
          filters.maxPrice != null
      ),
    [filters]
  );

  // ─── Queries ──────────────────────────────────────────────

  const listingsQuery = useQuery({
    queryKey: ["listings", "search", debouncedFilters],
    queryFn: () => searchListings(debouncedFilters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["listings", "categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });

  const locationsQuery = useQuery({
    queryKey: ["listings", "locations"],
    queryFn: fetchLocations,
    staleTime: 5 * 60_000,
  });

  return {
    // Filters
    filters,
    hasActiveFilters,
    setKeyword,
    setCategory,
    setLocation,
    setMinPrice,
    setMaxPrice,
    setPage,
    clearFilters,
    // Data
    listings: listingsQuery.data,
    isLoading: listingsQuery.isLoading,
    isFetching: listingsQuery.isFetching,
    isError: listingsQuery.isError,
    categories: categoriesQuery.data ?? [],
    locations: locationsQuery.data ?? [],
  };
}
