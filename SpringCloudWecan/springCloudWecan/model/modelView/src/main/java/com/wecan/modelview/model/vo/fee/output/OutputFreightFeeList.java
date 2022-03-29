/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/27 14:44
 */
package com.wecan.modelview.model.vo.fee.output;

import com.wecan.commonutils.commonClass.util.NumberUtil;
import lombok.Data;
import lombok.Getter;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Formatter;
import java.util.List;
@Data
public class OutputFreightFeeList {



    private Long feeid;
    /**
     * 始发港
     */
    private String sfg;

    /**
     * 目的港
     */

    private String mdg;

    /**
     * 中转港 直达填''
     */
    private String zzg;




    private LocalDateTime startdate;

    /**
     * 结束时间
     */

    private LocalDateTime enddate;

    /**
     * 标准价格模式 1 随直达价 2 固定价格
     */
    private Integer feeMode;

    /**
     * 标准价格
     */
    private BigDecimal standardPrice;

    public String getStandardPrice(){
     return "￥"+ NumberUtil.format(this.standardPrice,"%.2f");
    }


    private String twocode;

    private String hbh;

    private String cusLevel;

    private String packageType;

    private String weight;

    private String volRatio;

    private String remark;

    private String addman;

    private LocalDateTime addtime;
    // 发布站点
    private String area;

    private BigDecimal minPrice;

    private String term;

    private String jfType;

    private Integer gid;


    private Integer realgid;


    public Integer getRealgid(){
        return gid;
    }

    // 一口价
    private BigDecimal fixedDiff;

    //是否含战争附加费

    private Boolean isContainWar;
    //是否含燃油附加费

    private Boolean isContainGas;
    //是否含地面货站费

    private Boolean isContainStation;
    //唯凯标准
    private String wecanStandard;

    public String getWecanStandard(){
        return this.getGid()>0?"客户标准":"唯凯标准";
    }


    public String getTerm() {

        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        term = df.format(startdate) + "至" + df.format(enddate);
        return term;
    }

}

