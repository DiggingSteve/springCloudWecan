package com.wecan.modeldbo.airfreight.fee;

import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.Parent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

/**
 * <p>
 * 
 * </p>
 *
 * @author test
 * @since 2021-05-06
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FeeAircompany")
@Table(name = "Ex_FeeAircompany")
@Entity
public class FeeAircompany extends Parent {

    private static final long serialVersionUID = 1L;

    @Column(name = "twocode",columnDefinition = "VARCHAR(10) COMMENT '二字码'")
    private String twocode;

    private Long feeid;
    @Column(
            name = "diff",
            columnDefinition = "decimal(4,2) COMMENT '差价'"
    )
    private BigDecimal diff;


}
