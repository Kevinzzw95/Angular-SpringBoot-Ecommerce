package domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@NoArgsConstructor
public class Address {

    @Id
    private String id;

    private String street;

    private String city;

    private String province;

    private String zipCode;

}
