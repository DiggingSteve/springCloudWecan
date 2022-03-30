/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/24 16:16
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.FeeAirFlightMapper;
import com.wecan.daofee.service.IFeeAirFlightService;
import com.wecan.modeldbo.airfreight.fee.FeeAirFlight;
import org.springframework.stereotype.Service;

@Service
public class FeeAirFlightServiceImpl extends ServiceImpl<FeeAirFlightMapper, FeeAirFlight> implements IFeeAirFlightService {
}
