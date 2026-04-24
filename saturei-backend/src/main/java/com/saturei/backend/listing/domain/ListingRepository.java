package com.saturei.backend.listing.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ListingRepository {

    @Query("SELECT l FROM Listing l JOIN FETCH l.seller WHERE l.seller.id = :sellerId")
    Page<Listing> findBySellerId(@Param("sellerId") UUID sellerId, Pageable pageable);

    @Query(value = """
            SELECT l.* FROM listings l
            JOIN users u ON l.seller_id = u.id
            WHERE l.status = 'ACTIVE'
            AND (CAST(:keyword AS text) IS NULL
                 OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (CAST(:category AS text) IS NULL OR l.category = :category)
            AND (CAST(:location AS text) IS NULL OR l.location = :location)
            AND (CAST(:minPrice AS numeric) IS NULL OR l.price >= CAST(:minPrice AS numeric))
            AND (CAST(:maxPrice AS numeric) IS NULL OR l.price <= CAST(:maxPrice AS numeric))
            ORDER BY l.created_at DESC, l.id ASC
            """,
            countQuery = """
            SELECT COUNT(*) FROM listings l
            WHERE l.status = 'ACTIVE'
            AND (CAST(:keyword AS text) IS NULL
                 OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (CAST(:category AS text) IS NULL OR l.category = :category)
            AND (CAST(:location AS text) IS NULL OR l.location = :location)
            AND (CAST(:minPrice AS numeric) IS NULL OR l.price >= CAST(:minPrice AS numeric))
            AND (CAST(:maxPrice AS numeric) IS NULL OR l.price <= CAST(:maxPrice AS numeric))
            """,
            nativeQuery = true)
    Page<Listing> search(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT l.category FROM Listing l
            WHERE l.status = com.saturei.backend.listing.domain.ListingStatus.ACTIVE
            AND l.category IS NOT NULL
            ORDER BY l.category ASC
            """)
    List<String> findDistinctCategories();

    @Query("""
            SELECT DISTINCT l.location FROM Listing l
            WHERE l.status = com.saturei.backend.listing.domain.ListingStatus.ACTIVE
            AND l.location IS NOT NULL
            ORDER BY l.location ASC
            """)
    List<String> findDistinctLocations();
}
