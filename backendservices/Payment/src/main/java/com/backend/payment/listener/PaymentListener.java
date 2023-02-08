package com.backend.payment.listener;

import com.backend.payment.service.PaymentService;
import domain.Order;
import domain.OrderStatus;
import domain.Topics;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PaymentListener {

    private final PaymentService paymentService;

    public PaymentListener(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @KafkaListener(id = "orders", topics = Topics.ORDERS, groupId = "payments")
    public void onEvent(Order o) {
        log.info("Received: {}" , o);
        if (o.getStatus().equals(OrderStatus.NEW))
            paymentService.reserve(o);
        else
            paymentService.confirm(o);
    }
}
