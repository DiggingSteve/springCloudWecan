/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/25 15:22
 */
package com.wecan.test.sharding;

import com.wecan.daofee.service.impl.OrderServiceImpl;
import com.wecan.modeldbo.sharding.Order;
import com.wecan.shardingTest.ShardingTestApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ShardingTestApplication.class)
public class MybatisTest {
    @Autowired
     OrderServiceImpl orderDao;
    @Test
    public void insert(){
        Order a=new Order();
        orderDao.save(a);
    }
}
