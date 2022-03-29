package com.wecan.modeldbo.airfreight.fee;

import com.wecan.modeldbo.Parent;
import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.airfreight.fee.enums.PackageTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

/**
 * <p>
 * 包装类型
 * </p>
 *
 * @author test
 * @since 2021-05-06
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FeePackageType")
@Table(name = "Ex_FeePackageType")
@Entity
public class FeePackageType extends Parent {

    private static final long serialVersionUID = 1L;

    /**
     * 1 散货 2 托盘
     */
    @Column(
            columnDefinition = "varchar(50) COMMENT '散货 托盘'"
    )
    private PackageTypeEnum code;

    private Long feeid;

    /**
     * 基准差价 -1 +1 类推
     */
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

}
