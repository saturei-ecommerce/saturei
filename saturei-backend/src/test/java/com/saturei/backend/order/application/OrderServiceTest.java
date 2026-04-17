package com.saturei.backend.order.application;

import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.listing.domain.vo.ConservationState;
import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import com.saturei.backend.order.application.dto.CreateOrderRequest;
import com.saturei.backend.order.application.dto.OrderResponse;
import com.saturei.backend.order.domain.Order;
import com.saturei.backend.order.domain.OrderItem;
import com.saturei.backend.order.domain.vo.OrderStatus;
import com.saturei.backend.order.domain.vo.PaymentMethod;
import com.saturei.backend.order.infrastructure.persistence.JpaOrderRepository;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    JpaOrderRepository orderRepository;
    @Mock
    JpaUserRepository userRepository;
    @Mock
    JpaListingRepository listingRepository;
    @Mock PaymentGatewayPortImpl paymentGateway;
    @InjectMocks OrderService orderService;

    private User user(UUID id) {
        return User.builder().id(id).name("User").email("u@test.com").password("pass").build();
    }

    private Listing listing(UUID id, ListingStatus status) {
        return Listing.builder()
                .id(id)
                .seller(user(UUID.randomUUID()))
                .title("Item " + id)
                .price(new BigDecimal("100.00"))
                .conservationState(ConservationState.USED)
                .status(status)
                .build();
    }

    private Order pendingOrder(UUID id, User buyer, List<OrderItem> items) {
        Order o = Order.builder()
                .id(id)
                .buyer(buyer)
                .status(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.PIX)
                .total(new BigDecimal("100.00"))
                .shippingAddress("Rua A, 1")
                .build();
        o.setItems(items);
        return o;
    }

    @Test
    void create_happyPath_savesOrderAndInitiatesPayment() {
        UUID buyerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        User buyer = user(buyerId);
        Listing l = listing(listingId, ListingStatus.ACTIVE);

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(buyer));
        when(listingRepository.findAllById(List.of(listingId))).thenReturn(List.of(l));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CreateOrderRequest req = new CreateOrderRequest(
                List.of(listingId), PaymentMethod.PIX, "Rua A, 1");

        OrderResponse response = orderService.create(req, buyerId);

        assertThat(response.buyerId()).isEqualTo(buyerId);
        assertThat(response.total()).isEqualTo(new BigDecimal("100.00"));
        assertThat(response.paymentMethod()).isEqualTo(PaymentMethod.PIX);
        verify(paymentGateway).initiatePayment(any());
        verify(listingRepository).saveAll(any());
    }

    @Test
    void create_whenBuyerNotFound_throwsNotFound() {
        UUID buyerId = UUID.randomUUID();
        when(userRepository.findById(buyerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.create(
                new CreateOrderRequest(List.of(UUID.randomUUID()), PaymentMethod.PIX, null), buyerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("user not found");
    }

    @Test
    void create_whenListingCountMismatch_throwsBadRequest() {
        UUID buyerId = UUID.randomUUID();
        UUID id1 = UUID.randomUUID();
        UUID id2 = UUID.randomUUID();

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(user(buyerId)));
        when(listingRepository.findAllById(any())).thenReturn(List.of(listing(id1, ListingStatus.ACTIVE)));

        assertThatThrownBy(() -> orderService.create(
                new CreateOrderRequest(List.of(id1, id2), PaymentMethod.PIX, null), buyerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("one or more listings not found");
    }

    @Test
    void create_whenListingNotActive_throwsBadRequest() {
        UUID buyerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(user(buyerId)));
        when(listingRepository.findAllById(List.of(listingId)))
                .thenReturn(List.of(listing(listingId, ListingStatus.SOLD)));

        assertThatThrownBy(() -> orderService.create(
                new CreateOrderRequest(List.of(listingId), PaymentMethod.PIX, null), buyerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("is not available");
    }

    @Test
    void create_setsListingsToSold() {
        UUID buyerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing l = listing(listingId, ListingStatus.ACTIVE);

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(user(buyerId)));
        when(listingRepository.findAllById(List.of(listingId))).thenReturn(List.of(l));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        orderService.create(new CreateOrderRequest(List.of(listingId), PaymentMethod.PIX, null), buyerId);

        assertThat(l.getStatus()).isEqualTo(ListingStatus.SOLD);
        verify(listingRepository).saveAll(List.of(l));
    }

    @Test
    void getById_whenOwnedByBuyer_returnsResponse() {
        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        User buyer = user(buyerId);
        Order o = pendingOrder(orderId, buyer, new ArrayList<>());

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(o));

        OrderResponse response = orderService.getById(orderId, buyerId);

        assertThat(response.id()).isEqualTo(orderId);
        assertThat(response.buyerId()).isEqualTo(buyerId);
    }

    @Test
    void getById_whenNotFound_throwsNotFound() {
        UUID orderId = UUID.randomUUID();
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getById(orderId, UUID.randomUUID()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("order not found");
    }

    @Test
    void getById_whenNotOwner_throwsForbidden() {
        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        Order o = pendingOrder(orderId, user(UUID.randomUUID()), new ArrayList<>());

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(o));

        assertThatThrownBy(() -> orderService.getById(orderId, buyerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("you do not own this order");
    }

    @Test
    void listByBuyer_delegatesToRepository() {
        UUID buyerId = UUID.randomUUID();
        Order o = pendingOrder(UUID.randomUUID(), user(buyerId), new ArrayList<>());
        Pageable pageable = Pageable.unpaged();

        when(orderRepository.findByBuyerId(buyerId, pageable))
                .thenReturn(new PageImpl<>(List.of(o)));

        Page<OrderResponse> result = orderService.listByBuyer(buyerId, pageable);

        assertThat(result).hasSize(1);
        verify(orderRepository).findByBuyerId(buyerId, pageable);
    }

    @Test
    void cancel_whenPending_cancelsOrderAndRestoresListings() {
        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        User buyer = user(buyerId);
        UUID listingId = UUID.randomUUID();
        Listing l = listing(listingId, ListingStatus.SOLD);
        OrderItem item = OrderItem.builder()
                .id(UUID.randomUUID())
                .listing(l)
                .priceAtPurchase(new BigDecimal("100.00"))
                .build();
        Order o = pendingOrder(orderId, buyer, List.of(item));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(o));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse response = orderService.cancel(orderId, buyerId);

        assertThat(response.status()).isEqualTo(OrderStatus.CANCELLED);
        assertThat(l.getStatus()).isEqualTo(ListingStatus.ACTIVE);
        verify(listingRepository).save(l);
    }

    @Test
    void cancel_whenNotFound_throwsNotFound() {
        UUID orderId = UUID.randomUUID();
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.cancel(orderId, UUID.randomUUID()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("order not found");
    }

    @Test
    void cancel_whenNotOwner_throwsForbidden() {
        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        Order o = pendingOrder(orderId, user(UUID.randomUUID()), new ArrayList<>());

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(o));

        assertThatThrownBy(() -> orderService.cancel(orderId, buyerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("you do not own this order");
    }

    @Test
    void cancel_whenNotPending_throwsBadRequest() {
        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        User buyer = user(buyerId);
        Order o = Order.builder()
                .id(orderId)
                .buyer(buyer)
                .status(OrderStatus.PAID)
                .paymentMethod(PaymentMethod.PIX)
                .total(new BigDecimal("100.00"))
                .build();
        o.setItems(new ArrayList<>());

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(o));

        assertThatThrownBy(() -> orderService.cancel(orderId, buyerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("only pending orders can be cancelled");
    }
}
