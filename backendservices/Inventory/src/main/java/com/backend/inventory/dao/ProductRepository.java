package com.backend.inventory.dao;

import com.backend.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ProductRepository extends MongoRepository<Product, String> {

    Page<Product> findByCategoryId(@Param("id") String id, Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);

    //Page<Product> findBySku(@Param("id") String sku, Pageable pageable);
}
