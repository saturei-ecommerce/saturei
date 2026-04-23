package com.saturei.backend.order.application;

import com.saturei.backend.order.domain.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class PaymentGatewayPortImpl implements PaymentGatewayPort {

    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayPortImpl.class);

    @Override
    public String initiatePayment(Order order) {
        log.warn("[PaymentGateway] initiatePayment called for order {} — real gateway not yet integrated", order.getId());
        return "";
    }

    @Override
    public void handleWebhook(String payload, String signature) {
        log.warn("[PaymentGateway] handleWebhook called — real gateway not yet integrated");
    }
}
