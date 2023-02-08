package com.backend.order.service;


import com.backend.order.dto.Purchase;
import com.backend.order.dto.PurchaseResponse;
import domain.Order;
import org.springframework.web.client.RestTemplate;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
    Order confirm(Order orderPayment, Order orderStock);
}
