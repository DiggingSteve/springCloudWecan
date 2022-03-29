package com.wecan.test.service.impl;

import com.wecan.test.entity.FeeWeight;
import com.wecan.test.mapper.FeeWeightMapper;
import com.wecan.test.service.IFeeWeightService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 重量等级和费用差值的关系 服务实现类
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Service
public class FeeWeightServiceImpl extends ServiceImpl<FeeWeightMapper, FeeWeight> implements IFeeWeightService {

}
