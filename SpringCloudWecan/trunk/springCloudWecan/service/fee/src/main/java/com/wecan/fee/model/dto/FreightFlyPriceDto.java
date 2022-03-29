package com.wecan.fee.model.dto;

import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class FreightFlyPriceDto {
    public List<FpHeader> headerList;
    public List<OutputFreightRouting> bodyList;
}


