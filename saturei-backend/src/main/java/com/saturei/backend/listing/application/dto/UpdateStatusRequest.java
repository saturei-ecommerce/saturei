package com.saturei.backend.listing.application.dto;

import com.saturei.backend.listing.domain.ListingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull ListingStatus status
) {}
