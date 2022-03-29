package com.wecan.modeldbo.airfreight.fee;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("ViewFeeFlyPrice")
public class ViewFeeFlyPrice {
    
    private Long feeid;

    private String sfg;

    private String mdg;

    private String zzg;

    private String remark;

    private String twocode;

    //private String weight;
    //private BigDecimal weightdiff;


    private BigDecimal standardPrice;

    private BigDecimal newStandardPrice;

    private LocalDateTime startdate;

    private LocalDateTime enddate;

    private Integer wffareaid;

    private String addman;

    private LocalDateTime addtime;

    private String jftype;

    private String area;

    private Integer gid;

    private String hbh;

    private  String cusLevel;

    private  BigDecimal cusDiff;

    private  BigDecimal truckMin;

    private  String packageType;

    private  BigDecimal packageTypeDiff;

    //private  String truckweight;

    //private  BigDecimal truckDiff;

    //private  BigDecimal minPrice;

    private BigDecimal mycPrice;


    private BigDecimal mycMin;

    private  BigDecimal truckFixedMin;

    private BigDecimal mscPrice;

    private  String Ddg;

    private BigDecimal mscMin;

    private BigDecimal truckminDiff;

    private String  truckTwocode;

    private Long truckFeeid;
}
