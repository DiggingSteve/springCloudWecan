package com.wecan.daoprice.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wecan.commonutils.commonClass.mybatis.GetQueryWrapper;
import com.wecan.daoprice.service.PriceMapperService;
import com.wecan.modeldbo.price.Price;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
/**
 * 增删改查的具体实现
 */
public class PriceAdoImpl {

    private static PriceMapperService priceService;

    @Autowired
    public void setPriceMapper(PriceMapperService priceService) {
        this.priceService = priceService;
    }

    public static List<Price> getAll() {
        var userList = priceService.selectList(null);
        return userList;
    }

    public static Object getGuid(Long guid) {
        var wrapper = new LambdaQueryWrapper<Price>()
                .eq(Price::getGuid, guid)
                .eq(Price::getRemark, "test")
                .like(Price::getPrice, "1231");
        var list = priceService.selectList(wrapper);
        return list;
    }

    public static Object getQuery(Long id) {
        var priceWrapper = new QueryWrapper<Price>();
        priceWrapper.and(wrapper -> wrapper.like("id", "1"));
        var list = priceService.selectList(priceWrapper);
        return list;
    }


    public static Object getByJson(String json) {
        var wrapperTest = GetQueryWrapper.getQueryWrapperByJsonStr(json, Price.class);
        var list = priceService.selectList(wrapperTest);
        return list;
    }


    public static Object insert(Price price) {
        priceService.insert(price);
        return null;
    }

    public static Object deleteById(Long id) {
        return priceService.deleteById(id);
    }

    public static Object updateById(Price price) {
        return priceService.updateById(price);
    }


}
