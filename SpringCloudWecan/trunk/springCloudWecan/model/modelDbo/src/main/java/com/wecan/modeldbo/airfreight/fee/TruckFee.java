/**
 * @description:
 * @author: yaodui
 * @time: 2021/6/30 10:39
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
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_TruckFee")
@Table(name = "Ex_TruckFee")
@Entity
public class TruckFee extends Parent {

    /**
     * 应付费用的id
     */

    public Long wageoutId;

    /**
     * 目的港
     */
    @Column(
            name = "mdg",
            columnDefinition = "varchar(20) COMMENT 'mdg'"
    )

    private String mdg;

    /**
     * 目的港
     */
    @Column(
            name = "area",
            columnDefinition = "varchar(20) COMMENT 'area'"
    )

    private String area;


    /**
     * zzg
     */
    @Column(
            name = "ddg",
            columnDefinition = "varchar(20) COMMENT '到达港指航司到目的地后最终由卡车运往的地方'"
    )
    public String ddg;

    @Column(
            name = "twocodeStr",
            columnDefinition = "varchar(200) COMMENT '航司二字码'"
    )
    public String twocodeStr;

    @Column(
            name = "min",
            columnDefinition = "decimal(8,2) default(0) COMMENT 'min重'"
    )
    public BigDecimal min;

    @Column(
            name = "minDiff",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'min重'"
    )
    public BigDecimal minDiff;

    @Column(
            name = "fixedMin",
            columnDefinition = "decimal(8,2) default(0) COMMENT 'min重'"
    )
    public BigDecimal fixedMin;

    @Column(
            name = "flat",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'flat'"
    )
    public BigDecimal flat;

    @Column(
            name = "flatDiff",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'min重'"
    )
    public BigDecimal flatDiff;

    @Column(
            name = "fixedFlat",
            columnDefinition = "decimal(6,2) default(0) COMMENT 'min重'"
    )
    public BigDecimal fixedFlat;

    @Column(
            name = "addman",
            columnDefinition = "varchar(50) COMMENT '添加人'"
    )
    public String addman;

    private LocalDateTime addtime;
    @Column(
            name = "wageinout",
            columnDefinition = "int COMMENT ''"
    )
    private Integer wageinout;

    @Override
    public int hashCode() {
        return Objects.hash(this.getGuid());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (obj instanceof TruckFee) {
            TruckFee d = (TruckFee) obj;
            return Objects.equals(this.getGuid(), d.getGuid());
        }
        return false;


    }


}
