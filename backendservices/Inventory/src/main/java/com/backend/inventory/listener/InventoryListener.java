package com.backend.inventory.listener;


import com.backend.inventory.Service.InventoryService;
import domain.Order;
import domain.OrderStatus;
import domain.Topics;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class InventoryListener {

    private final InventoryService inventoryService;

    public InventoryListener(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @KafkaListener(id = "orders", topics = Topics.ORDERS, groupId = "stock")
    public void onEvent(Order o) {
        log.info("Received: {}" , o);
        if (o.getStatus().equals(OrderStatus.NEW))
            inventoryService.reserve(o);
        else
            inventoryService.confirm(o);
    }
}
