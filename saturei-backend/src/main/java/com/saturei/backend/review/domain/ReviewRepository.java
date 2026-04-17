package com.saturei.backend.review.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReviewRepository {
    Page<Review> findByReviewedId(UUID reviewedId, Pageable pageable);
    boolean existsByOrderId(UUID orderId);
}
