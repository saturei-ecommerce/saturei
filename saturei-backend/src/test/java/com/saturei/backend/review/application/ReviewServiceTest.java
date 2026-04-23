package com.saturei.backend.review.application;

import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.order.domain.Order;
import com.saturei.backend.order.domain.OrderItem;
import com.saturei.backend.order.domain.vo.OrderStatus;
import com.saturei.backend.review.application.dto.CreateReviewRequest;
import com.saturei.backend.review.domain.Review;
import com.saturei.backend.review.infrastructure.persistence.JpaReviewRepository;
import com.saturei.backend.order.infrastructure.persistence.JpaOrderRepository;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.domain.UserPermissions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private JpaReviewRepository reviewRepository;

    @Mock
    private JpaOrderRepository orderRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void createShouldCreateReviewSuccessfully() {
        UUID orderId = UUID.randomUUID();

        User buyer = buildUser(
                UUID.randomUUID(),
                "buyer@test.com",
                "Buyer User"
        );

        User seller = buildUser(
                UUID.randomUUID(),
                "seller@test.com",
                "Seller User"
        );

        Listing listing = buildListing(UUID.randomUUID(), seller);
        Order order = buildOrder(orderId, buyer, OrderStatus.DELIVERED, List.of(buildOrderItem(UUID.randomUUID(), listing)));
        CreateReviewRequest request = new CreateReviewRequest(orderId, 5, "  Great   seller  ");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(reviewRepository.existsByOrderId(orderId)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> {
            Review review = invocation.getArgument(0);
            review.setId(UUID.randomUUID());
            review.setCreatedAt(LocalDateTime.now());
            return review;
        });

        Review result = reviewService.create(request, "BUYER@TEST.COM");

        assertNotNull(result);
        assertEquals(orderId, result.getOrder().getId());
        assertEquals(buyer.getId(), result.getReviewer().getId());
        assertEquals(seller.getId(), result.getReviewed().getId());
        assertEquals(5, result.getRating());
        assertEquals("Great seller", result.getComment());

        ArgumentCaptor<Review> reviewCaptor = ArgumentCaptor.forClass(Review.class);
        verify(reviewRepository).save(reviewCaptor.capture());

        Review savedReview = reviewCaptor.getValue();
        assertEquals(buyer.getId(), savedReview.getReviewer().getId());
        assertEquals(seller.getId(), savedReview.getReviewed().getId());
        assertEquals(orderId, savedReview.getOrder().getId());
        assertEquals(5, savedReview.getRating());
        assertEquals("Great seller", savedReview.getComment());

        verify(orderRepository).findById(orderId);
        verify(reviewRepository).existsByOrderId(orderId);
    }

    @Test
    void createShouldThrowConflictWhenReviewAlreadyExistsForOrder() {
        UUID orderId = UUID.randomUUID();
        User buyer = buildUser(UUID.randomUUID(), "buyer@test.com", "Buyer User");
        User seller = buildUser(UUID.randomUUID(), "seller@test.com", "Seller User");
        Listing listing = buildListing(UUID.randomUUID(), seller);
        Order order = buildOrder(orderId, buyer, OrderStatus.DELIVERED, List.of(buildOrderItem(UUID.randomUUID(), listing)));
        CreateReviewRequest request = new CreateReviewRequest(orderId, 5, "Great seller");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(reviewRepository.existsByOrderId(orderId)).thenReturn(true);

        ApiException exception = assertThrows(ApiException.class,
                () -> reviewService.create(request, "buyer@test.com"));

        assertEquals("Review already exists for this order.", exception.getMessage());
        verify(orderRepository).findById(orderId);
        verify(reviewRepository).existsByOrderId(orderId);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createShouldThrowBadRequestWhenOrderIsNotDelivered() {
        UUID orderId = UUID.randomUUID();
        User buyer = buildUser(UUID.randomUUID(), "buyer@test.com", "Buyer User");
        User seller = buildUser(UUID.randomUUID(), "seller@test.com", "Seller User");
        Listing listing = buildListing(UUID.randomUUID(), seller);
        Order order = buildOrder(orderId, buyer, OrderStatus.PAID, List.of(buildOrderItem(UUID.randomUUID(), listing)));
        CreateReviewRequest request = new CreateReviewRequest(orderId, 4, "Good");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(reviewRepository.existsByOrderId(orderId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class,
                () -> reviewService.create(request, "buyer@test.com"));

        assertEquals("Only delivered orders can be reviewed.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createShouldThrowForbiddenWhenAuthenticatedUserIsNotTheBuyer() {
        UUID orderId = UUID.randomUUID();
        User buyer = buildUser(UUID.randomUUID(), "buyer@test.com", "Buyer User");
        User seller = buildUser(UUID.randomUUID(), "seller@test.com", "Seller User");
        Listing listing = buildListing(UUID.randomUUID(), seller);
        Order order = buildOrder(orderId, buyer, OrderStatus.DELIVERED, List.of(buildOrderItem(UUID.randomUUID(), listing)));
        CreateReviewRequest request = new CreateReviewRequest(orderId, 4, "Good");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(reviewRepository.existsByOrderId(orderId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class,
                () -> reviewService.create(request, "another-user@test.com"));

        assertEquals("You are not allowed to review this order.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createShouldThrowBadRequestWhenOrderHasMultipleSellers() {
        UUID orderId = UUID.randomUUID();

        User buyer = buildUser(UUID.randomUUID(), "buyer@test.com", "Buyer User");
        User sellerOne = buildUser(UUID.randomUUID(), "seller1@test.com", "Seller One");
        User sellerTwo = buildUser(UUID.randomUUID(), "seller2@test.com", "Seller Two");

        Listing listingOne = buildListing(UUID.randomUUID(), sellerOne);
        Listing listingTwo = buildListing(UUID.randomUUID(), sellerTwo);

        OrderItem itemOne = buildOrderItem(UUID.randomUUID(), listingOne);
        OrderItem itemTwo = buildOrderItem(UUID.randomUUID(), listingTwo);

        Order order = buildOrder(orderId, buyer, OrderStatus.DELIVERED, List.of(itemOne, itemTwo));
        CreateReviewRequest request = new CreateReviewRequest(orderId, 5, "Great");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(reviewRepository.existsByOrderId(orderId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class,
                () -> reviewService.create(request, "buyer@test.com"));

        assertEquals("Order contains multiple sellers and cannot receive a single review.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void listByUserShouldReturnReceivedReviewsPage() {
        UUID reviewedUserId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

        User reviewer = buildUser(UUID.randomUUID(), "reviewer@test.com", "Reviewer User");
        User reviewed = buildUser(reviewedUserId, "reviewed@test.com", "Reviewed User");
        Listing listing = buildListing(UUID.randomUUID(), reviewed);
        Order order = buildOrder(UUID.randomUUID(), reviewer, OrderStatus.DELIVERED, List.of(buildOrderItem(UUID.randomUUID(), listing)));

        Review review = Review.builder()
                .id(UUID.randomUUID())
                .reviewer(reviewer)
                .reviewed(reviewed)
                .order(order)
                .rating(5)
                .comment("Excellent")
                .createdAt(LocalDateTime.now())
                .build();

        Page<Review> page = new PageImpl<>(List.of(review), pageable, 1);

        when(reviewRepository.findByReviewedId(reviewedUserId, pageable)).thenReturn(page);

        Page<Review> result = reviewService.listByUser(reviewedUserId, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Excellent", result.getContent().get(0).getComment());

        verify(reviewRepository).findByReviewedId(reviewedUserId, pageable);
    }

    private User buildUser(UUID id, String email, String name) {
        return User.builder()
                .id(id)
                .email(email)
                .password("encoded-password")
                .name(name)
                .permissions(List.of(UserPermissions.BUYER))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Listing buildListing(UUID id, User seller) {
        return Listing.builder()
                .id(id)
                .seller(seller)
                .title("Used item")
                .description("Item description")
                .price(BigDecimal.valueOf(100))
                .build();
    }

    private OrderItem buildOrderItem(UUID id, Listing listing) {
        return OrderItem.builder()
                .id(id)
                .listing(listing)
                .priceAtPurchase(BigDecimal.valueOf(100))
                .build();
    }

    private Order buildOrder(UUID id, User buyer, OrderStatus status, List<OrderItem> items) {
        Order order = Order.builder()
                .id(id)
                .buyer(buyer)
                .status(status)
                .total(BigDecimal.valueOf(100))
                .items(items)
                .createdAt(LocalDateTime.now())
                .build();

        items.forEach(item -> item.setOrder(order));
        return order;
    }
}