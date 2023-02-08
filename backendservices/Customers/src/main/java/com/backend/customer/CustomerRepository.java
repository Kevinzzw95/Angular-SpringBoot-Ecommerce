package com.backend.customer;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface CustomerRepository extends MongoRepository<Customer, String> {

    Customer findByEmail(@Param("email") String theEmail);

}
