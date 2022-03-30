/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/25 15:30
 */
package com.wecan.shardingTest.controller;

import com.wecan.daofee.service.impl.OrderServiceImpl;
import com.wecan.modeldbo.sharding.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.GET;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {
    @Autowired
    OrderServiceImpl orderDao;

    @GetMapping("/insert")
    @GET
    public Object insert() {
        List<Order> list=new ArrayList();
        for (int i = 0; i < 100; i++) {
            Order a = new Order();

            list.add(a);

        }
        orderDao.saveBatch(list);
        return orderDao.list();
    }
}
