/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/24 16:10
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
@TableName("Ex_FeeAirFlight")
@Table(name="Ex_FeeAirFlight")
@Entity
public class FeeAirFlight extends Parent {

    private static final long serialVersionUID = 1L;

    @Column(name = "hbh",columnDefinition = "VARCHAR(20) COMMENT '航班号'")
    private String hbh;

    private Long feeid;

    @Column(name = "schedule",columnDefinition = "VARCHAR(20) COMMENT '航班周期'")
    //航班周期 1,3,5 代表 周一周三周五
    private String schedule;

    @Column(name = "remark",columnDefinition = "VARCHAR(200) COMMENT '备注'")
    private String remark;

    @Column(
            name = "isSelfInput",
            columnDefinition = "int COMMENT '是否自定义输入 1是 2否'"
    )
    private Integer isSelfInput;

}
