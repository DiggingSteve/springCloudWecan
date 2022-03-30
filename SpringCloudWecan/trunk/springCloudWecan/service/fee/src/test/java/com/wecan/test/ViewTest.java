package com.wecan.test;

import com.wecan.daofee.mapper.ViewFreightFeeMapper;
import com.wecan.fee.FeeApplication;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

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
