/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 15:55
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.FeeWeightMapper;
import com.wecan.daofee.mapper.ITruckFeeMapper;
import com.wecan.daofee.service.IFeeWeightService;
import com.wecan.daofee.service.ITruckFeeService;
import com.wecan.modeldbo.airfreight.fee.FeeWeight;
import com.wecan.modeldbo.airfreight.fee.TruckFee;
import org.springframework.stereotype.Service;

@Service
public class TruckFeeServiceImpl extends ServiceImpl<ITruckFeeMapper, TruckFee> implements ITruckFeeService {
}
