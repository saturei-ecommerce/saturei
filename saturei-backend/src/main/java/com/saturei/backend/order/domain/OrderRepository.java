package com.saturei.backend.order.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface OrderRepository {
    Page<Order> findByBuyerId(UUID buyerId, Pageable pageable);
}
