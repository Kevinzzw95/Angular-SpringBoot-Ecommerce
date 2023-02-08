package com.backend.inventory.Service;

import com.backend.inventory.dao.ProductRepository;
import com.backend.inventory.entity.Product;
import domain.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class InventoryServiceImpl implements InventoryService{

    private final ProductRepository productRepository;
    private final KafkaTemplate<String, Order> kafkaTemplate;
    private static final OrderSource SOURCE = OrderSource.STOCK;
    private static final String TOPIC = Topics.STOCK;

    public InventoryServiceImpl(ProductRepository productRepository, KafkaTemplate<String, Order> kafkaTemplate) {
        this.productRepository = productRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void reserve(Order order) {

        if(order.getStatus().equals(OrderStatus.NEW)) {
            for(OrderItem item : order.getOrderItems()) {
                Product product = productRepository.findById(item.getProductId()).orElseThrow();
                if(product.getUnitsInStock() >= item.getQuantity()) {
                    product.setReserved(product.getReserved() + item.getQuantity());
                    product.setUnitsInStock(product.getUnitsInStock() - item.getQuantity());
                    order.setStatus(OrderStatus.ACCEPT);
                    productRepository.save(product);
                }
                else {
                    order.setStatus(OrderStatus.REJECT);
                }
                order.setSource(SOURCE);
                kafkaTemplate.send(TOPIC, order.getId(), order);
                log.info("Sent: {}", order);
            }
        }

    }

    @Override
    public void confirm(Order order) {
        if (order.getStatus().equals(OrderStatus.CONFIRMED)) {
            for(OrderItem item : order.getOrderItems()) {
                Product product = productRepository.findById(item.getProductId()).orElseThrow();
                product.setReserved(product.getReserved() - item.getQuantity());
                productRepository.save(product);
            }
        }
        else if(order.getStatus().equals(OrderStatus.ROLLBACK) && !order.getSource().equals(SOURCE)) {
            for(OrderItem item : order.getOrderItems()) {
                Product product = productRepository.findById(item.getProductId()).orElseThrow();
                product.setReserved(product.getReserved() - item.getQuantity());
                product.setUnitsInStock(product.getUnitsInStock() + item.getQuantity());
                productRepository.save(product);
            }
        }
    }
}
