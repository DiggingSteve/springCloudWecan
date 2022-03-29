package com.wecan.test;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.wecan.daofee.mapper.ViewFreightFeeMapper;
import com.wecan.fee.FeeApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;

import java.lang.reflect.Field;

/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/25 17:32
 */

@RunWith(SpringRunner.class)
@SpringBootTest(classes = FeeApplication.class)
public class ViewTest {
    @Autowired
    ViewFreightFeeMapper viewDao;



}
