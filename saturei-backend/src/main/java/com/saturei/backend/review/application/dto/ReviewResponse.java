package com.saturei.backend.review.application.dto;

import com.saturei.backend.review.domain.Review;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID reviewerId,
        String reviewerName,
        UUID reviewedId,
        String reviewedName,
        UUID orderId,
        int rating,
        String comment,
        LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getReviewer().getId(),
                review.getReviewer().getName(),
                review.getReviewed().getId(),
                review.getReviewed().getName(),
                review.getOrder().getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}