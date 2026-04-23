package com.saturei.backend.shared.config;

import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.listing.domain.vo.ConservationState;
import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import com.saturei.backend.order.domain.Order;
import com.saturei.backend.order.domain.OrderItem;
import com.saturei.backend.order.domain.vo.OrderStatus;
import com.saturei.backend.order.domain.vo.PaymentMethod;
import com.saturei.backend.order.infrastructure.persistence.JpaOrderRepository;
import com.saturei.backend.review.domain.Review;
import com.saturei.backend.review.infrastructure.persistence.JpaReviewRepository;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.domain.UserPermissions;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);
    private static final String DEFAULT_PASSWORD = "12345678";

    private final JpaUserRepository userRepository;
    private final JpaListingRepository listingRepository;
    private final JpaOrderRepository orderRepository;
    private final JpaReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (hasAnyData()) {
            log.info("Dev seed skipped: database already contains data.");
            return;
        }

        User buyer = userRepository.save(buildUser(
                "buyer@test.com",
                "Buyer User",
                List.of(UserPermissions.BUYER)
        ));

        User sellerOne = userRepository.save(buildUser(
                "seller1@test.com",
                "Seller One",
                List.of(UserPermissions.SELLER)
        ));

        User sellerTwo = userRepository.save(buildUser(
                "seller2@test.com",
                "Seller Two",
                List.of(UserPermissions.SELLER)
        ));

        Listing listingOne = listingRepository.save(buildListing(
                sellerOne,
                "PlayStation 4 Slim 1TB",
                "Console usado em ótimo estado, acompanha controle e cabos.",
                BigDecimal.valueOf(1800),
                ConservationState.USED,
                ListingStatus.ACTIVE,
                List.of(
                        "https://images.example.com/ps4-1.jpg",
                        "https://images.example.com/ps4-2.jpg"
                ),
                "Games",
                "Bauru/SP"
        ));

        Listing listingTwo = listingRepository.save(buildListing(
                sellerTwo,
                "iPhone 12 128GB",
                "Aparelho funcionando perfeitamente, bateria em bom estado.",
                BigDecimal.valueOf(2500),
                ConservationState.USED,
                ListingStatus.ACTIVE,
                List.of(
                        "https://images.example.com/iphone12-1.jpg"
                ),
                "Eletrônicos",
                "Lençóis Paulista/SP"
        ));

        Listing listingThree = listingRepository.save(buildListing(
                sellerOne,
                "Mesa de escritório",
                "Mesa seminova, madeira clara, muito conservada.",
                BigDecimal.valueOf(450),
                ConservationState.USED,
                ListingStatus.SOLD,
                List.of(
                        "https://images.example.com/desk-1.jpg"
                ),
                "Móveis",
                "Botucatu/SP"
        ));

        Order deliveredOrderWithoutReview = buildOrder(
                buyer,
                listingOne,
                OrderStatus.DELIVERED,
                PaymentMethod.PIX,
                "Rua Exemplo, 123 - Lençóis Paulista/SP"
        );
        deliveredOrderWithoutReview = orderRepository.save(deliveredOrderWithoutReview);

        Order deliveredOrderWithReview = buildOrder(
                buyer,
                listingTwo,
                OrderStatus.DELIVERED,
                PaymentMethod.CREDIT_CARD,
                "Av. Brasil, 456 - Bauru/SP"
        );
        deliveredOrderWithReview = orderRepository.save(deliveredOrderWithReview);

        Order pendingOrder = buildOrder(
                buyer,
                listingThree,
                OrderStatus.PENDING,
                PaymentMethod.BOLETO,
                "Rua das Flores, 789 - Botucatu/SP"
        );
        orderRepository.save(pendingOrder);

        Review seededReview = Review.builder()
                .reviewer(buyer)
                .reviewed(sellerTwo)
                .order(deliveredOrderWithReview)
                .rating(5)
                .comment("Produto excelente e vendedor muito atencioso.")
                .build();
        reviewRepository.save(seededReview);

        log.info("Dev seed created successfully.");
        log.info("Test users:");
        log.info("buyer@test.com / {}", DEFAULT_PASSWORD);
        log.info("seller1@test.com / {}", DEFAULT_PASSWORD);
        log.info("seller2@test.com / {}", DEFAULT_PASSWORD);
    }

    private boolean hasAnyData() {
        return userRepository.count() > 0
                || listingRepository.count() > 0
                || orderRepository.count() > 0
                || reviewRepository.count() > 0;
    }

    private User buildUser(String email, String name, List<UserPermissions> permissions) {
        return User.builder()
                .email(email)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .name(name)
                .permissions(permissions)
                .build();
    }

    private Listing buildListing(
            User seller,
            String title,
            String description,
            BigDecimal price,
            ConservationState conservationState,
            ListingStatus status,
            List<String> imageUrls,
            String category,
            String location
    ) {
        return Listing.builder()
                .seller(seller)
                .title(title)
                .description(description)
                .price(price)
                .conservationState(conservationState)
                .status(status)
                .imageUrls(imageUrls)
                .category(category)
                .location(location)
                .build();
    }

    private Order buildOrder(
            User buyer,
            Listing listing,
            OrderStatus status,
            PaymentMethod paymentMethod,
            String shippingAddress
    ) {
        Order order = Order.builder()
                .buyer(buyer)
                .status(status)
                .paymentMethod(paymentMethod)
                .total(listing.getPrice())
                .shippingAddress(shippingAddress)
                .build();

        OrderItem item = OrderItem.builder()
                .order(order)
                .listing(listing)
                .priceAtPurchase(listing.getPrice())
                .build();

        order.setItems(List.of(item));
        return order;
    }
}