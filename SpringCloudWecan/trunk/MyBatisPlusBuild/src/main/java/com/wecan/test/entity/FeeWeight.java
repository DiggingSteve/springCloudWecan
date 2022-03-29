package com.wecan.test.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 重量等级和费用差值的关系
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("Ex_FeeWeight")
public class FeeWeight implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * +50kg 默认单位是kg
     */
    private Integer code;

    private BigDecimal diff;

    private Long feeid;


}
