package com.saturei.backend.order.application;

import com.saturei.backend.order.domain.Order;
import org.springframework.stereotype.Component;

@Component
public class PaymentGatewayPortImpl implements PaymentGatewayPort {

    // TODO: implement methods

    @Override
    public String initiatePayment(Order order) {
        return "";
    }

    @Override
    public void handleWebhook(String payload, String signature) {

    }
}
