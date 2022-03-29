package com.wecan.commonmsgqueue;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MyQueueSender {
    private static AmqpTemplate amqpTemplate;

    @Autowired
    public void setAmqpTemplate(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    private String exchange = "change";

    private String routingkey = "key";

    public void sendTest(String message) {
        amqpTemplate.convertAndSend(this.exchange, this.routingkey, message);
    }
}
