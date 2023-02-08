package com.backend.payment.service;

import domain.Order;
import domain.OrderSource;
import domain.Topics;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static domain.OrderStatus.*;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService{

    private static final OrderSource SOURCE = OrderSource.PAYMENT;
    private final KafkaTemplate<String, Order> kafkaTemplate;
    private static final String TOPIC = Topics.PAYMENTS;

    public PaymentServiceImpl( KafkaTemplate<String, Order> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void reserve(Order order) {
        order.setStatus(ACCEPT);
        order.setSource(SOURCE);
        kafkaTemplate.send(TOPIC, order.getId(), order);
        log.info("Sent: {}", order);
    }

    @Override
    public void confirm(Order order) {

    }
}
