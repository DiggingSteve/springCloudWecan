package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.modeldbo.airfreight.fee.*;
import com.wecan.daofee.mapper.FeeVolMapper;
import com.wecan.daofee.service.IFeeVolService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 尺寸比和费用的关系 服务实现类
 * </p>
 *
 * @author test
 * @since 2021-05-06
 */
@Service
public class FeeVolServiceImpl extends ServiceImpl<FeeVolMapper, FeeVolRatio> implements IFeeVolService {

}
