/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/18 13:23
 */
package com.wecan.modelview.model.vo.fee.view;

import lombok.Data;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class ViewFixedFreightFee {

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

    /**
     * 标准价格模式 1 随直达价 2 固定价格
     */
    private Integer feeMode;

    /**
     * 标准价格
     */
    private BigDecimal standardPrice;

    private String twocode;

    private Integer wffAreaid;

    private  String remark;

    private String addman;

    private String jfType;

    private LocalDateTime addtime;
    //发布站点
    private String area;

    private BigDecimal minPrice;

    private Integer gid;

    // 一口价
    private BigDecimal diff;

    public String cus;

    public String packageType;

    public  String vol;

    public String weight;

    public String hbh;

}
