package com.backend.customer;

import com.backend.customer.Customer;
import lombok.AllArgsConstructor;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("api")
@EnableFeignClients
public class CustomerController {

    private CustomerService customerService;

    @PostMapping(path = "/addCustomer")
    public String updateFav(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);
    }
}
