/**
 * @description:
 * @author: yaodui
 * @time: 2021/12/2 14:36
 */
package com.wecan.fee.rabbitmq;

import com.wecan.commonmsgqueue.RabbitMqSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class Sender {
    @Autowired
    private RabbitMqSender sender;

    @Value("${spring.rabbitmq.fee.exchange}")
    private String exchage;

    @Value("${spring.rabbitmq.fee.routing-key}")
    public String routingKey;

    public Boolean sendMsg(String msg) {
        return sender.sendMsg(msg, exchage, routingKey);
    }

}
