/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/20 15:53
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
@TableName("Ex_TruckFeeAircompany")
@Table(name = "Ex_TruckFeeAircompany")
@Entity
public class TruckFeeAircompany extends Parent {
    private static final long serialVersionUID = 1L;

    @Column(name = "twocode",columnDefinition = "VARCHAR(10) COMMENT '二字码'")
    private String twocode;

    private Long feeid;

}
