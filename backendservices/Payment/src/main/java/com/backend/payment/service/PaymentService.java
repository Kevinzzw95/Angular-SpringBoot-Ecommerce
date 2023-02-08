package com.backend.payment.service;

import domain.Order;

public interface PaymentService {

    void reserve(Order order);

    void confirm(Order order);
}
