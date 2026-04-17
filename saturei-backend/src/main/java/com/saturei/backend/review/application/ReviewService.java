package com.saturei.backend.review.application;

import com.saturei.backend.review.infrastructure.persistence.JpaReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final JpaReviewRepository reviewRepository;

    // TODO: implement create, listByUser
}
