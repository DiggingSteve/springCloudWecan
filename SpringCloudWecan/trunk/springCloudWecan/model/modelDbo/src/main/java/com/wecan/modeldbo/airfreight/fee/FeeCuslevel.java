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
 * 客户等级和价格差值关系
 * </p>
 *
 * @author test
 * @since 2021-05-06
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FeeCuslevel")
@Table(name = "Ex_FeeCuslevel")
@Entity
public class FeeCuslevel extends Parent {

    private static final long serialVersionUID = 1L;
    @Column(
            columnDefinition = "varchar(50) COMMENT '客户等级'"
    )
    private String code;

    private Long feeid;
    @Column(
            name = "diff",
            columnDefinition = "decimal(4,2) COMMENT '差价'"
    )
    private BigDecimal diff;

    //列表前端默认只显示选中的值
    @Column(
            name = "isDefault",
            columnDefinition = "int COMMENT '是否默认选中值 1 是 2 否'"
    )
    private Integer isDefault;

    //列表前端默认只显示选中的值
    @Column(
            name = "isAdd",
            columnDefinition = "int COMMENT '是否被添加 1 是 2 否'"
    )
    private Integer isAdd;

    @Column(
            name = "isSameAsBase",
            columnDefinition = "int COMMENT '是否等于基点 1 是 2 否'"
    )
    public Boolean isSameAsBase;


}
