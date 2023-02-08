package com.backend.order.dto;


import domain.Address;
import domain.Customer;
import domain.Order;
import domain.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Order order;
    private Address shippingAddress;
    private Address billingAddress;
    private Set<OrderItem> orderItems;
}
