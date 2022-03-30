/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/17 17:31
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.FixedFreightFeeMapper;
import com.wecan.daofee.service.IFixedFreightFeeService;
import com.wecan.modeldbo.airfreight.fee.FixedFreightFee;
import org.springframework.stereotype.Service;

@Service
public class FixedFreightFeeSerivceImpl extends ServiceImpl<FixedFreightFeeMapper, FixedFreightFee> implements IFixedFreightFeeService {
}
