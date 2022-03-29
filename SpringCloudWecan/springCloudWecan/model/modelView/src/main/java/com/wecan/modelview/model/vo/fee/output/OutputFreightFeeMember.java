/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/27 17:43
 */
package com.wecan.modelview.model.vo.fee.output;

import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
public class OutputFreightFeeMember {
    /**
     * 开始时间
     */
    private Long feeid;

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


    private String twocodeArr;

    private String cusLevel;

    private String packageType;

    private String weight;

    private String volRatio;

    private String term;




}
