/**
 * @description:
 * @author: yaodui
 * @time: 2021/6/30 13:22
 */
package com.wecan.modeldbo.airfreight.fee;

import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.Parent;
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
@TableName("Ex_TruckFeeWeight")
@Table(name = "Ex_TruckFeeWeight")
@Entity
public class TruckFeeWeight extends Parent {

    private static final long serialVersionUID = 1L;

    /**
     * +50kg 默认单位是kg
     */
    @Column(
            columnDefinition = "varchar(50) COMMENT '重量代码'"
    )
    private String code;
    @Column(
            name = "diff",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'diff'"
    )
    private BigDecimal diff;
    @Column(
            name = "feeid",
            columnDefinition = "bigint COMMENT '费用id'"
    )
    private Long feeid;

    @Column(
            name = "wageinDiff",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'wageinDiff'"
    )
    private BigDecimal wageinDiff;

    @Column(
            name = "fixedDiff",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'fixedDiff'"
    )
    private BigDecimal fixedDiff;
}
