package com.saturei.backend.review.application.dto;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record CreateReviewRequest(
        @NotNull UUID orderId,
        @Min(1) @Max(5) int rating,
        String comment
) {}
