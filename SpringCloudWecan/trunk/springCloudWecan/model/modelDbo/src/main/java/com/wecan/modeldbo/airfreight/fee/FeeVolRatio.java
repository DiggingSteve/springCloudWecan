package com.wecan.modeldbo.airfreight.fee;

import com.wecan.modeldbo.Parent;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

/**
 * <p>
 * 尺寸比和费用的关系
 * </p>
 *
 * @author test
 * @since 2021-05-06
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FeeVolRatio")
@Table(name="Ex_FeeVolRatio")
@Entity
public class FeeVolRatio extends Parent {

    private static final long serialVersionUID = 1L;
    @Column(
            columnDefinition = "varchar(50) COMMENT '体积代码'"
    )
    private String code;
    @Column(
            name = "diff",
            columnDefinition = "decimal(4,2) COMMENT '差价'"
    )
    private BigDecimal diff;

    private Long feeid;

    //列表前端默认只显示选中的值
    @Column(
            name = "isDefault",
            columnDefinition = "int COMMENT '是否默认选中值 1 是 2 否'"
    )
    private Integer isDefault;

    //是否设置了vol的勾稽关系 当前默认渲染1:167 为基点
    @Column(
            name = "isSetValue",
            columnDefinition = "int COMMENT '是否设置值 1 是 2 否'"
    )
    private Integer isSetValue;
}
