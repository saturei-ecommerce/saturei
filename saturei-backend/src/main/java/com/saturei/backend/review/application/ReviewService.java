package com.saturei.backend.review.application;

import com.saturei.backend.order.domain.Order;
import com.saturei.backend.order.domain.OrderItem;
import com.saturei.backend.order.domain.vo.OrderStatus;
import com.saturei.backend.order.infrastructure.persistence.JpaOrderRepository;
import com.saturei.backend.review.application.dto.CreateReviewRequest;
import com.saturei.backend.review.domain.Review;
import com.saturei.backend.review.infrastructure.persistence.JpaReviewRepository;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final JpaReviewRepository reviewRepository;
    private final JpaOrderRepository orderRepository;

    public Review create(CreateReviewRequest request, String reviewerEmail) {
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> ApiException.notFound("Order not found."));

        if (reviewRepository.existsByOrderId(order.getId())) {
            throw ApiException.conflict("Review already exists for this order.");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw ApiException.badRequest("Only delivered orders can be reviewed.");
        }

        if (order.getBuyer() == null || order.getBuyer().getEmail() == null) {
            throw ApiException.badRequest("Order buyer is invalid.");
        }

        if (!order.getBuyer().getEmail().equalsIgnoreCase(normalizeEmail(reviewerEmail))) {
            throw ApiException.forbidden("You are not allowed to review this order.");
        }

        User reviewedUser = extractReviewedUser(order);
        User reviewerUser = order.getBuyer();

        if (reviewerUser.getId().equals(reviewedUser.getId())) {
            throw ApiException.badRequest("You cannot review yourself.");
        }

        Review review = Review.builder()
                .order(order)
                .reviewer(reviewerUser)
                .reviewed(reviewedUser)
                .rating(request.rating())
                .comment(normalizeComment(request.comment()))
                .build();

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public Page<Review> listByUser(UUID userId, Pageable pageable) {
        return reviewRepository.findByReviewedId(userId, pageable);
    }

    private User extractReviewedUser(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw ApiException.badRequest("Order has no items to review.");
        }

        List<User> sellers = order.getItems().stream()
                .map(OrderItem::getListing)
                .filter(Objects::nonNull)
                .map(listing -> listing.getSeller())
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (sellers.isEmpty()) {
            throw ApiException.badRequest("Order has no seller associated with its items.");
        }

        if (sellers.size() > 1) {
            throw ApiException.badRequest("Order contains multiple sellers and cannot receive a single review.");
        }

        return sellers.get(0);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String normalizeComment(String comment) {
        if (comment == null || comment.isBlank()) {
            return null;
        }
        return comment.trim().replaceAll("\\s+", " ");
    }
}