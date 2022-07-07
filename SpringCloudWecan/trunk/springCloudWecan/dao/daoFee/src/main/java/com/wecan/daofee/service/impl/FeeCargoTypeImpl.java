/**
 * @description:
 * @author: yaodui
 * @time: 2022/6/22 9:29
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.FeeApprovalRecordMapper;
import com.wecan.daofee.mapper.FeeCargoTypeMapper;
import com.wecan.daofee.service.IFeeApprovalRecordService;
import com.wecan.daofee.service.IFeeCargoTypeService;
import com.wecan.modeldbo.airfreight.fee.FeeApprovalRecord;
import com.wecan.modeldbo.airfreight.fee.FeeCargoType;
import org.springframework.stereotype.Service;

@Service
public class FeeCargoTypeImpl  extends ServiceImpl<FeeCargoTypeMapper, FeeCargoType> implements IFeeCargoTypeService {
}
