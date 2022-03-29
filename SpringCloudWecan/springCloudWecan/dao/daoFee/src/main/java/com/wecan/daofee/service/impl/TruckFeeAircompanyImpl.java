/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/20 16:05
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.TruckFeeAirCompanyMapper;
import com.wecan.daofee.service.ITruckFeeAirCompanyService;
import com.wecan.modeldbo.airfreight.fee.TruckFeeAircompany;
import org.springframework.stereotype.Service;

@Service
public class TruckFeeAircompanyImpl extends ServiceImpl<TruckFeeAirCompanyMapper, TruckFeeAircompany>implements ITruckFeeAirCompanyService {
}
