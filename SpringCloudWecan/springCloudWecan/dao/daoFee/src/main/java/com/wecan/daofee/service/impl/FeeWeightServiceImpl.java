package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.modeldbo.airfreight.fee.*;
import com.wecan.daofee.mapper.FeeWeightMapper;
import com.wecan.daofee.service.IFeeWeightService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 重量等级和费用差值的关系 服务实现类
 * </p>
 *
 * @author test
 * @since 2021-05-06
 */
@Service
public class FeeWeightServiceImpl extends ServiceImpl<FeeWeightMapper, FeeWeight> implements IFeeWeightService {

}
