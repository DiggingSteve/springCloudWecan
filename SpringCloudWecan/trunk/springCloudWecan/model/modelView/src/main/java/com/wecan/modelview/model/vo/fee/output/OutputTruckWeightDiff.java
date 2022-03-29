/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/11 16:32
 */
package com.wecan.modelview.model.vo.fee.output;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class OutputTruckWeightDiff {

    public OutputTruckWeightDiff(){

    }

    private  Long guid;

    private String code;

    private BigDecimal diff;

    private BigDecimal wageinDiff;

    private  BigDecimal fixedDiff;
}
