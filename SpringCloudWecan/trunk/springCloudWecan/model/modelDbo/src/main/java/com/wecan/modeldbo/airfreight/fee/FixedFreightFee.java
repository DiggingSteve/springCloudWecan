/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/17 13:23
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

/**
 * 一口价（修正价格）
 * 通过直接维护价格 记录对应的体积重量 货型
 * **/
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FixedFreightFee")
@Table(name="Ex_FixedFreightFee")
@Entity
public class FixedFreightFee extends Parent {
    private Long feeid;

    /**
     * 一口价直接无视标准价格
     */
    @Column(
            name = "diff",
            columnDefinition = "decimal(8,2) COMMENT '一口价'"
    )
    private BigDecimal diff;

    @Column(
            columnDefinition = "varchar(50) COMMENT '客户类型'"
    )
    public String cus;

    @Column(
            columnDefinition = "varchar(50) COMMENT '货型类型'"
    )
    public String packageType;

    @Column(
            columnDefinition = "varchar(50) COMMENT '体积'"
    )
    public  String vol;


    @Column(
            columnDefinition = "varchar(50) COMMENT '重量'"
    )
    public String weight;




}
