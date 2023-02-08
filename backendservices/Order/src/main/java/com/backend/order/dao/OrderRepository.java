package com.backend.order.dao;

import domain.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;
import java.util.Set;

@RepositoryRestResource
public interface OrderRepository extends MongoRepository<Order, String > {

    Set<Order> findByEmail(@Param("email") String theEmail);
}
