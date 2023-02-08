package com.backend.order.service;

import com.backend.order.clients.CustomerClient;
import com.backend.order.dao.AddressRepository;
import com.backend.order.dao.OrderItemRepository;
import com.backend.order.dao.OrderRepository;
import com.backend.order.dto.Purchase;
import com.backend.order.dto.PurchaseResponse;

import domain.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

import static domain.OrderStatus.*;
import static domain.OrderSource.*;



@Service
@Slf4j
public class CheckoutServiceImpl implements CheckoutService{

    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final CustomerClient customerClient;
    private final KafkaTemplate<String, Order> kafkaTemplate;
    private Customer customer;
    private final AtomicLong id = new AtomicLong();

    public CheckoutServiceImpl(OrderItemRepository orderItemRepository,
                               AddressRepository addressRepository,
                               OrderRepository orderRepository,
                               CustomerClient customerClient,
                               KafkaTemplate<String, Order> kafkaTemplate) {
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.customerClient = customerClient;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve the order from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String trackingNumber = generateTrackingNumber();
        order.setTrackingNumber(trackingNumber);

        // populate address with order
        Address shippingAddress = purchase.getShippingAddress();
        Address billingAddress = purchase.getBillingAddress();
        addressRepository.save(shippingAddress);
        addressRepository.save(billingAddress);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        //save items
        //orderItems.forEach(item -> orderItemRepository.save(item));
        orderItemRepository.saveAll(orderItems);
        orderItems.forEach(item -> order.add(item));

        // populate customer with order
        customer = purchase.getCustomer();

        // check if this is an existing customer
        String theEmail = customer.getEmail();

        order.setEmail(theEmail);

        orderRepository.save(order);
        // send new order to Kafka stream
        //order.setStatus(OrderStatus.NEW);
        //log.info("Sent: {}", order);
        //kafkaTemplate.send(Topics.ORDERS, order.getId(), order);

        //customerClient.addCustomer(customer);

        // return response
        return new PurchaseResponse(trackingNumber);
    }

    private String generateTrackingNumber() {
        // generate a UUID
        return UUID.randomUUID().toString();
    }

    @Override
    @Transactional
    public Order confirm(Order orderPayment, Order orderStock) {

        Order o = Order.builder()
                .id(orderPayment.getId())
                .email(orderPayment.getEmail())
                .shippingAddress(orderPayment.getShippingAddress())
                .billingAddress(orderPayment.getBillingAddress())
                .totalPrice(orderPayment.getTotalPrice())
                .totalQuantity(orderPayment.getTotalQuantity())
                .orderItems(orderPayment.getOrderItems())
                .build();

        if (orderPayment.getStatus().equals(ACCEPT) &&
                orderStock.getStatus().equals(ACCEPT)) {
            o.setStatus(CONFIRMED);
        } else if (orderPayment.getStatus().equals(REJECT) &&
                orderStock.getStatus().equals(REJECT)) {
            o.setStatus(REJECTED);
        } else if (orderPayment.getStatus().equals(REJECT) ||
                orderStock.getStatus().equals(REJECT)) {
            OrderSource source = orderPayment.getStatus().equals(REJECT)
                    ? PAYMENT : STOCK;
            o.setStatus(OrderStatus.ROLLBACK);
            o.setSource(source);
        }
        if(o.getStatus().equals(CONFIRMED) && customer != null) {
            // save to the database
            orderRepository.save(o);
            customerClient.addCustomer(customer);
        }
        return o;
    }
}
