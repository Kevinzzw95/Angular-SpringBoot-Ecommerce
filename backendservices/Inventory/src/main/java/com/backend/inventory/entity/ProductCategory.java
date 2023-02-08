package com.backend.inventory.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
public class ProductCategory {

    @Id
    private String id;

    private String categoryName;

    private String categoryId;

}
