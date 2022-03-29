package com.wecan.test.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 客户等级和价格差值关系
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("Ex_FeeCuslevel")
public class FeeCuslevel implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer code;

    private Long feeid;

    private BigDecimal diff;


}
