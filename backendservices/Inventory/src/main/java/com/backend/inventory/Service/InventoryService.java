package com.backend.inventory.Service;

import domain.Order;

public interface InventoryService {

    void reserve(Order order);

    void confirm(Order order);
}
