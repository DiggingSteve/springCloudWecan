/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/18 14:56
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.FeeApprovalRecordMapper;
import com.wecan.daofee.service.IFeeApprovalRecordService;
import com.wecan.modeldbo.airfreight.fee.FeeApprovalRecord;
import org.springframework.stereotype.Service;

@Service
public class FeeApprovalRecordServiceImpl extends ServiceImpl<FeeApprovalRecordMapper, FeeApprovalRecord>implements IFeeApprovalRecordService {
}
