/**
 * @description:
 * @author: yaodui
 * @time: 2022/6/21 15:59
 */
package com.wecan.modeldbo.airfreight.fee;

import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.Parent;
import com.wecan.modeldbo.airfreight.fee.enums.PackageTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FeeCargoType")
@Table(name = "Ex_FeeCargoType")
@Entity
public class FeeCargoType extends Parent {

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
            columnDefinition = "int COMMENT '是否默认选中值 1 是 0 否'"
    )
    private Boolean isDefault;

    //列表前端默认只显示选中的值
    @Column(
            name = "isAdd",
            columnDefinition = "int COMMENT '是否被添加 1 是 0 否'"
    )
    private Boolean isAdd;

    @Column(
            name = "isSameAsBase",
            columnDefinition = "int COMMENT '是否等于基点 1 是 0 否'"
    )
    public Boolean isSameAsBase;
}
