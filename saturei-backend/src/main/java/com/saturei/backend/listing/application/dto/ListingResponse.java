package com.saturei.backend.listing.application.dto;

import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.listing.domain.vo.ConservationState;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ListingResponse(
        UUID id,
        UUID sellerId,
        String sellerName,
        String title,
        String description,
        BigDecimal price,
        ConservationState conservationState,
        ListingStatus status,
        List<String> imageUrls,
        String category,
        String location,
        LocalDateTime createdAt
) {
    public static ListingResponse from(Listing listing) {
        return new ListingResponse(
                listing.getId(),
                listing.getSeller().getId(),
                listing.getSeller().getName(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getPrice(),
                listing.getConservationState(),
                listing.getStatus(),
                listing.getImageUrls(),
                listing.getCategory(),
                listing.getLocation(),
                listing.getCreatedAt()
        );
    }
}
