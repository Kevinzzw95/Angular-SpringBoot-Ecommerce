package domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.*;

@Getter
@Setter
@Document("order")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EnableMongoAuditing
public class Order {

    @Id
    private String id;

    private String email;

    @DBRef
    private Address shippingAddress;

    @DBRef
    private Address billingAddress;

    private OrderStatus status;

    private OrderSource source;

    private BigDecimal totalPrice;

    private int totalQuantity;

    private String trackingNumber;

    @DBRef
    private Set<OrderItem> orderItems = new HashSet<>();

    @CreatedDate
    private Date dateCreated;

    public void add(OrderItem orderItem) {

        if(orderItem != null) {
            if(orderItems == null) {
                orderItems = new HashSet<>();
            }

            orderItems.add(orderItem);
            orderItem.setOrderId(this.getId());
        }
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", email=" + email +
                ", shippingAddress=" + shippingAddress +
                ", billingAddress=" + billingAddress +
                ", totalPrice=" + totalPrice +
                ", totalQuantity=" + totalQuantity +
                ", status=" + status +
                ", source=" + source +
                ", trackingNumber=" + trackingNumber +
                ", orderItems=" + orderItems +
                '}';
    }
}
