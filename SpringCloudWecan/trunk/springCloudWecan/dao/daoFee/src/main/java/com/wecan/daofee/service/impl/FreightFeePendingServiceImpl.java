/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/17 14:01
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.FixedFreightFeeMapper;
import com.wecan.daofee.mapper.FreightFeePendingMapper;
import com.wecan.daofee.service.IFixedFreightFeeService;
import com.wecan.daofee.service.IFreightFeePendingService;
import com.wecan.modeldbo.airfreight.fee.FixedFreightFee;
import com.wecan.modeldbo.airfreight.fee.FreightFeePending;
import org.springframework.stereotype.Service;

@Service
public class FreightFeePendingServiceImpl extends ServiceImpl<FreightFeePendingMapper, FreightFeePending> implements IFreightFeePendingService {
}
