package com.wecan.test.service.impl;

import com.wecan.test.entity.FeeVol;
import com.wecan.test.mapper.FeeVolMapper;
import com.wecan.test.service.IFeeVolService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 尺寸比和费用的关系 服务实现类
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Service
public class FeeVolServiceImpl extends ServiceImpl<FeeVolMapper, FeeVol> implements IFeeVolService {

}
