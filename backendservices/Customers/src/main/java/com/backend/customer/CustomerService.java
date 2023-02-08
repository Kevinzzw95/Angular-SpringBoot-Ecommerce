package com.backend.customer;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

import static org.apache.logging.log4j.message.MapMessage.MapFormat.JSON;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    public String addCustomer(Customer customer) {

        String theEmail = customer.getEmail();
        if(customerRepository.findByEmail(theEmail) == null) {
            customerRepository.save(customer);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("code", "200");
        map.put("result", "add " + theEmail + " # " + " success!");
        return map.toString();

    }
}
