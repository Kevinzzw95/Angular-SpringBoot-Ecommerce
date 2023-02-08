package com.backend.order.config;

import com.backend.order.service.CheckoutService;
import com.backend.order.service.CheckoutServiceImpl;
import domain.Order;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.JoinWindows;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.StreamJoined;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.support.serializer.JsonSerde;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.time.Duration;

import static domain.Topics.*;

@Slf4j
@Configuration
public class KafkaConfig {

    private final CheckoutService checkoutService;

    public KafkaConfig(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @Bean
    public NewTopic orders() {
        return TopicBuilder.name("orders")
                .partitions(3)
                .compact()
                .build();
    }

    @Bean
    public NewTopic paymentTopic() {
        return TopicBuilder.name("payments")
                .partitions(3)
                .compact()
                .build();
    }

    @Bean
    public NewTopic stockTopic() {
        return TopicBuilder.name("stock")
                .partitions(3)
                .compact()
                .build();
    }

    //this is the one that will get results from other topics to check
    @Bean
    public KStream<Long, Order> stream(StreamsBuilder builder) {
        //provides serialization and deserialization in JSON format

        JsonSerde<Order> orderSerde = new JsonSerde<>(Order.class);
        KStream<Long, Order> stream = builder
                .stream(PAYMENTS, Consumed.with(Serdes.Long(), orderSerde));

        stream.join(
                        builder.stream(STOCK),
                        checkoutService::confirm,
                        JoinWindows.of(Duration.ofSeconds(10)),
                        StreamJoined.with(Serdes.Long(), orderSerde, orderSerde))
                .peek((k, o) -> log.info("Output: {}", o))
                .to(ORDERS);

        return stream;
    }

    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(5);
        executor.setThreadNamePrefix("kafkaSender-");
        executor.initialize();
        return executor;
    }

}
