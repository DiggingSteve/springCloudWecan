package com.wecan.test.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 包装类型
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("Ex_FeePackageType")
public class FeePackageType implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 1 散货 2 托盘
     */
    private Integer code;

    private Long feeid;

    /**
     * 基准差价 -1 +1 类推
     */
    private BigDecimal diff;


}
