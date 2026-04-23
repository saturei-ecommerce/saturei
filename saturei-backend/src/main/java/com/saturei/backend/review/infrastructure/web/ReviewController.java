package com.saturei.backend.review.infrastructure.web;

import com.saturei.backend.review.application.ReviewService;
import com.saturei.backend.review.application.dto.CreateReviewRequest;
import com.saturei.backend.review.application.dto.ReviewResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> create(
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ReviewResponse.from(
                        reviewService.create(request, authentication.getName())
                ));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Page<ReviewResponse>> listByUser(
            @PathVariable UUID userId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                reviewService.listByUser(userId, pageable)
                        .map(ReviewResponse::from)
        );
    }
}