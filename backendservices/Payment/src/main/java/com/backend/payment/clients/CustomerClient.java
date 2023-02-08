package com.backend.payment.clients;

import domain.Customer;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("customer")
public interface CustomerClient {

    @PostMapping("api/addCustomer")
    String addCustomer(@RequestBody Customer customer);
}
