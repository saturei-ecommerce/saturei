package com.saturei.backend.listing.application.dto;

import com.saturei.backend.listing.domain.vo.ConservationState;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UpdateListingRequest(
        String title,
        String description,
        @Positive BigDecimal price,
        ConservationState conservationState,
        String category,
        String location
) {}
