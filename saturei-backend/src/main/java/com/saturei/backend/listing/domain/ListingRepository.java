package com.saturei.backend.listing.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

    @Query("SELECT l FROM Listing l JOIN FETCH l.seller WHERE l.seller.id = :sellerId")
    Page<Listing> findBySellerId(@Param("sellerId") UUID sellerId, Pageable pageable);

    @Query("""
            SELECT l FROM Listing l JOIN FETCH l.seller
            WHERE l.status = com.saturei.backend.listing.domain.ListingStatus.ACTIVE
            AND (:keyword IS NULL OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:category IS NULL OR l.category = :category)
            AND (:location IS NULL OR l.location = :location)
            AND (:minPrice IS NULL OR l.price >= :minPrice)
            AND (:maxPrice IS NULL OR l.price <= :maxPrice)
            ORDER BY l.createdAt DESC
            """)
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
