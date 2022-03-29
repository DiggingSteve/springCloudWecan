/**
 * @description:
 * @author: yaodui
 * @time: 2021/12/2 14:04
 */
package com.wecan.commonmsgqueue;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RabbitMqSender {
    @Autowired
    private RabbitTemplate mqTemplate;



    public Boolean sendMsg(String msg,String exchage,String routingKey){
        Boolean flag=false;
        try {
            mqTemplate.convertAndSend(exchage, routingKey, msg);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return false;
        }
        return true;
    }
}
