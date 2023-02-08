package com.backend.inventory.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Document("product")
@NoArgsConstructor
public class Product {

    @Id
    private String id;

    private String sku;

    private String name;

    private String description;

    private BigDecimal unitPrice;

    private String imageUrl;

    private boolean active;

    private int unitsInStock;

    private int reserved;

    private Date dateCreated;

    private Date lastUpdated;

    private String categoryId;

    public Product(String sku, String name, String description, BigDecimal unitPrice, String imageUrl, boolean active, int unitsInStock, Date dateCreated, Date lastUpdated, String categoryId) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.imageUrl = imageUrl;
        this.active = active;
        this.unitsInStock = unitsInStock;
        this.dateCreated = dateCreated;
        this.lastUpdated = lastUpdated;
        this.categoryId = categoryId;
    }
}
