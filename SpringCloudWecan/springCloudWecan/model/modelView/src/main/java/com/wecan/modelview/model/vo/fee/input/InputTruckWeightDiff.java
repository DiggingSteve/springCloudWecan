/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 14:35
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;

import javax.persistence.Column;
import java.math.BigDecimal;

@Data
public class InputTruckWeightDiff {

    public InputTruckWeightDiff(){

    }

    private  Long guid;

    private String code;

    private BigDecimal diff;

    private BigDecimal wageinDiff;

    private  BigDecimal fixedDiff;

}
