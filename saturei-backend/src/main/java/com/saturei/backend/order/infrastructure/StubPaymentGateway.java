package com.saturei.backend.order.infrastructure;

import com.saturei.backend.order.application.PaymentGatewayPort;
import com.saturei.backend.order.domain.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Stub implementation of PaymentGatewayPort for local development.
 * Replace with the real payment gateway integration before going to production.
 */
@Component
@Profile({"dev", "test"})
public class StubPaymentGateway implements PaymentGatewayPort {

    private static final Logger log = LoggerFactory.getLogger(StubPaymentGateway.class);

    @Override
    public String initiatePayment(Order order) {
        log.warn("[STUB] initiatePayment called for order {} — no real payment processed", order.getId());
        return "stub-payment-intent-" + order.getId();
    }

    @Override
    public void handleWebhook(String payload, String signature) {
        log.warn("[STUB] handleWebhook called — no real payment processed");
    }
}
