package com.backend.customer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Document("customer")
@NoArgsConstructor
public class Customer {

    @Id
    private String id;

    //private String userName;

    private String firstName;

    private String lastName;

    private String email;

    //private String address;

}
