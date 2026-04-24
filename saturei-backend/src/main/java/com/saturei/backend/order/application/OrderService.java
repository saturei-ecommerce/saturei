package com.saturei.backend.order.application;

import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import com.saturei.backend.order.application.dto.CreateOrderRequest;
import com.saturei.backend.order.application.dto.OrderResponse;
import com.saturei.backend.order.domain.Order;
import com.saturei.backend.order.domain.OrderItem;
import com.saturei.backend.order.domain.vo.OrderStatus;
import com.saturei.backend.order.infrastructure.persistence.JpaOrderRepository;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final JpaOrderRepository orderRepository;
    private final JpaUserRepository userRepository;
    private final JpaListingRepository listingRepository;
    private final PaymentGatewayPort paymentGateway;

    @Transactional
    public OrderResponse create(CreateOrderRequest request, UUID buyerId) {
        var buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> ApiException.notFound("user not found"));

        var listings = listingRepository.findAllById(request.listingIds());
        if (listings.size() != request.listingIds().size()) {
            throw ApiException.badRequest("one or more listings not found");
        }

        listings.forEach(l -> {
            if (l.getStatus() != ListingStatus.ACTIVE) {
                throw ApiException.badRequest("listing '" + l.getTitle() + "' is not available");
            }
        });

        BigDecimal total = listings.stream()
                .map(l -> l.getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        var order = Order.builder()
                .buyer(buyer)
                .paymentMethod(request.paymentMethod())
                .shippingAddress(request.shippingAddress())
                .total(total)
                .build();

        List<OrderItem> items = listings.stream()
                .map(l -> OrderItem.builder()
                        .order(order)
                        .listing(l)
                        .priceAtPurchase(l.getPrice())
                        .build())
                .toList();

        order.setItems(items);
        var saved = orderRepository.save(order);

        paymentGateway.initiatePayment(saved);

        listings.forEach(l -> l.setStatus(ListingStatus.SOLD));
        listingRepository.saveAll(listings);

        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(UUID id, UUID buyerId) {
        var order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("order not found"));
        if (!order.getBuyer().getId().equals(buyerId)) {
            throw ApiException.forbidden("you do not own this order");
        }
        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> listByBuyer(UUID buyerId, Pageable pageable) {
        return orderRepository.findByBuyerId(buyerId, pageable).map(OrderResponse::from);
    }

    @Transactional
    public OrderResponse cancel(UUID id, UUID buyerId) {
        var order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("order not found"));
        if (!order.getBuyer().getId().equals(buyerId)) {
            throw ApiException.forbidden("you do not own this order");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw ApiException.badRequest("only pending orders can be cancelled");
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.getItems().forEach(item -> {
            var listing = item.getListing();
            listing.setStatus(ListingStatus.ACTIVE);
            listingRepository.save(listing);
        });
        return OrderResponse.from(orderRepository.save(order));
    }
}
