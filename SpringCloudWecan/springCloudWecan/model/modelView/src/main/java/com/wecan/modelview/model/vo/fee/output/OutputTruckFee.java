/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/5 13:52
 */
package com.wecan.modelview.model.vo.fee.output;

import com.wecan.commonutils.commonClass.util.NumberUtil;
import com.wecan.modelview.model.vo.fee.input.InputTruckFee;
import com.wecan.modelview.model.vo.fee.input.InputTruckWeightDiff;
import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class OutputTruckFee  {
    public  OutputTruckFee(){
        codeArr=new ArrayList<>();
    }
    public Long feeid;

    public String addman;

    public LocalDateTime addtime;



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


    public Integer wageinout;


    List<OutputTruckWeightDiff> codeArr;



}
