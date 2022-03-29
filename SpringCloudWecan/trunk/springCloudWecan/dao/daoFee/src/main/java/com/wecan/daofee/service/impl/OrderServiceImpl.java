/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/25 14:03
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.OrderMapper;
import com.wecan.daofee.service.IOrderService;
import com.wecan.modeldbo.sharding.Order;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements IOrderService {
}
