package com.wecan.test.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("Ex_FreightFee")
public class FreightFee implements Serializable {

    private static final long serialVersionUID = 1L;

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

    /**
     * 起步价
     */
    private BigDecimal minPrice;


}
