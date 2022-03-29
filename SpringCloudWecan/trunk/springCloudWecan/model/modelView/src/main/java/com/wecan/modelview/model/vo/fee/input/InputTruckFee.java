/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 14:29
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
public class InputTruckFee extends InputBaseVo{
    public  InputTruckFee(){
        codeArr=new ArrayList<>();
    }

    public Long feeid;

    public String area;

    // 应付的费用id
    public  Long wageoutId;

    public String mdg;


    public String ddg;


    //拼接的二字碼
    public String twocodeStr;


    public BigDecimal min;

    public BigDecimal minDiff;

    public BigDecimal fixedMin;

    public BigDecimal flat;

    public BigDecimal flatDiff;

    public  BigDecimal fixedFlat;

    public String addman;

    public LocalDateTime addtime;

    public Integer wageinout;


    List<InputTruckWeightDiff>codeArr;
}
