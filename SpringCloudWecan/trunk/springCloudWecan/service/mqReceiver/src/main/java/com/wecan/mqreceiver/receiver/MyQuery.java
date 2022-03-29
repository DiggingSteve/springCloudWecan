package com.wecan.mqreceiver.receiver;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.rabbit.annotation.*;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RabbitListener(bindings = @QueueBinding(
        exchange = @Exchange(value = "change", type = ExchangeTypes.TOPIC),
        value = @Queue(value = "key"),
        key = "*"))
public class MyQuery {
    @RabbitHandler
    public void process(String message) {

        log.info("computer message : {}", message);
    }
}
