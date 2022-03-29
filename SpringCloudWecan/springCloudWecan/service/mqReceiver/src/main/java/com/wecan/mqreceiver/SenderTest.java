package com.wecan.mqreceiver;

import com.wecan.commonmsgqueue.MyQueueSender;
import lombok.Data;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;


@RestController
@Data
public class SenderTest {

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public void senderTest() {
        for (int i = 0; i < 100; i++) {
            new MyQueueSender().sendTest("第" + i + "条消息" +  new Date().getTime() );
        }
    }
}
