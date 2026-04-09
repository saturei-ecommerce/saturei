package com.saturei.backend.listing.application.dto;

import java.math.BigDecimal;

public record SearchListingRequest(
        String keyword,
        String category,
        String location,
        BigDecimal minPrice,
        BigDecimal maxPrice
) {}
