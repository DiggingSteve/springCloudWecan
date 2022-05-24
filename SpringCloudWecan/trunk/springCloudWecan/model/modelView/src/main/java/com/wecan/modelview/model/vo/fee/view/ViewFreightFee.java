/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/24 18:01
 */
package com.wecan.modelview.model.vo.fee.view;
import lombok.Data;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
public class ViewFreightFee {

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

    /**
     * 开始时间
     */

    private LocalDateTime startdate;

    /**
     * 结束时间
     */

    private LocalDateTime enddate;







    private String twocode;

    private String cusLevel;

    private BigDecimal cusDiff;

    private String packageType;

    private BigDecimal packageTypeDiff;

    private String weight;

    private BigDecimal weightDiff;

    private String volRatio;

    private BigDecimal volRatioDiff;

    private  Integer isDefaultPackage;

    private  Integer isDefaultCus;

    private  Integer isDefaultWeight;

    private  Integer isDefaultVol;

    private Integer wffAreaid;

    private  String remark;

    private String addman;

    private String jfType;

    private LocalDateTime addtime;
    //发布站点
    private String area;



    private Integer gid;

    private String hbh;

    //审批状态
    private Integer approvalStatus;

    private String approvalMan;

    private LocalDateTime approvalTime;

    private Boolean isExpired;

}
