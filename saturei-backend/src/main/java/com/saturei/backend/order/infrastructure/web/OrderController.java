package com.saturei.backend.order.infrastructure.web;

import com.saturei.backend.order.application.OrderService;
import com.saturei.backend.order.application.PaymentGatewayPort;
import com.saturei.backend.order.application.dto.CreateOrderRequest;
import com.saturei.backend.order.application.dto.OrderResponse;
import com.saturei.backend.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentGatewayPort paymentGatewayPort;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> list(@AuthenticationPrincipal User user, Pageable pageable) {
        return ResponseEntity.ok(orderService.listByBuyer(user.getId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@AuthenticationPrincipal User user,
                                                @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, user.getId()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancel(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.cancel(id, user.getId()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody String payload,
                                        @RequestHeader("X-Signature") String signature) {
        paymentGatewayPort.handleWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }
}
