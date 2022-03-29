/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 16:06
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.TruckFeeWeightMapper;
import com.wecan.daofee.service.ITruckFeeWeightService;
import com.wecan.modeldbo.airfreight.fee.TruckFeeWeight;
import org.springframework.stereotype.Service;

@Service
public class TruckFeeWeightServiceImpl extends ServiceImpl<TruckFeeWeightMapper, TruckFeeWeight> implements ITruckFeeWeightService {
}
