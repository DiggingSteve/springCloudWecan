/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/20 14:53
 */
package com.wecan.daofee.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

@Component
public class FeeMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        this.setFieldValByName("isdel", 1,metaObject);
    }

    @Override
    public void updateFill(MetaObject metaObject) {

    }

}
