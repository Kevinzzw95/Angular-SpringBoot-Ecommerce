package domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@Document("orderItem")
@NoArgsConstructor
public class OrderItem implements Serializable {

    @Id
    private String id;

    private String imageUrl;

    private BigDecimal unitPrice;

    private int quantity;

    private String productId;

    private String orderId;

}
