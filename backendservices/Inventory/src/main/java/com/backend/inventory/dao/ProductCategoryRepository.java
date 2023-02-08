package com.backend.inventory.dao;

import com.backend.inventory.entity.ProductCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "productCategories", path = "product-category")
public interface ProductCategoryRepository extends MongoRepository<ProductCategory, String> {
}
