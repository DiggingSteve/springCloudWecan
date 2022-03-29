/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/26 18:12
 */
package com.wecan.modelview.model.vo.fee.view;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 运价结合卡车路线视图 给出routing 供bo查询
 */
@Data
public class ViewFreightRouting {

    private Long feeid;

    private String addman;

    private String sfg;

    private String zzg;

    //基港就是运价上的mdg 以及 卡车算运费的基港 终点可能是mdg 可能是ddg
    private  String mdg;

    private String ddg;

    private String twocode;

    // 卡车对应的航司 取出null值说明本条路线没有匹配 卡车段
    private String truckTwocode;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String remark;

    private Integer gid;

    private BigDecimal standardPrice;

    private Long truckFeeid;

    private Integer wffAreaid;

    private String hbh;

    /**
     * 标准价格
     */
    private String jfType;

    private  BigDecimal minPrice;


}
