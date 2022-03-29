package com.wecan.modeldbo.airfreight.fee;

import com.wecan.modeldbo.Parent;
import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.airfreight.fee.enums.FeeModeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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
@TableName("Ex_FreightFee")
@Table(name="Ex_FreightFee")
@Entity
public class FreightFee extends Parent {

    private static final long serialVersionUID = 1L;

    /**
     * 始发港
     */
    @Column(
            name = "sfg",
            columnDefinition = "varchar(20) COMMENT '始发港'"
    )
    private  String sfg;

    /**
     * 目的港
     */
    @Column(
            name = "mdg",
            columnDefinition = "varchar(20) COMMENT '目的港'"
    )
    private String mdg;

    /**
     * 中转港 直达
     */
    @Column(
            name = "zzg",
            columnDefinition = "varchar(20) COMMENT '中转港'"
    )
    private String zzg;

    /**
     * 开始时间
     */
    private LocalDateTime startdate;

    /**
     * 结束时间
     */
    private LocalDateTime enddate;

    private LocalDateTime addtime;







    /**
     * 如果选择tact差值模式 需要填写差值
     * */
    @Column(
            name = "wffAreaid",
            columnDefinition = "int COMMENT '航线分区id'"
    )
    private Integer wffAreaid;

    @Column(
            name = "remark",
            columnDefinition = "varchar(200) COMMENT 'remark'"
    )
    private String remark;
    @Column(
            name = "addman",
            columnDefinition = "varchar(20) COMMENT 'addman'"
    )
    private String addman;

    @Column(
            name = "jfType",
            columnDefinition = "varchar(20) COMMENT '计费方式 CW GW'"
    )
    private String jfType;
    @Column(
            name = "area",
            columnDefinition = "varchar(20) COMMENT '发布地区'"
    )
    private String area;

    @Column(
            name = "gid",
            columnDefinition = "int COMMENT 'gid'"
    )
    private Integer gid;

    @Column(
            name = "twocode",
            columnDefinition = "varchar(100) COMMENT '二字码'"
    )
    private String twocode;

    @Column(
            name = "hbh",
            columnDefinition = "varchar(100) COMMENT '航班号'"
    )
    private String hbh;

    //是否含战争附加费
    @Column(
            name = "isContainWar",
            columnDefinition = "bit default(1) COMMENT '是否含战争附加费'"
    )
    private Boolean isContainWar;
    //是否含燃油附加费
    @Column(
            name = "isContainGas",
            columnDefinition = "bit default(1) COMMENT '是否含燃油附加费'"
    )
    private Boolean isContainGas;
    //是否含地面货站费
    @Column(
            name = "isContainStation",
            columnDefinition = "bit default(1) COMMENT  '是否含地面货站费'"
    )
    private Boolean isContainStation;

    @Column(
            name = "isSpecifiedFlight",
            columnDefinition = "bit default(0) COMMENT  '是否特定航班'"
    )
    private Boolean isSpecifiedFlight;

    @Column(
            name = "limitDay",
            columnDefinition = "int COMMENT 'limitDay'"
    )
    //清关后多久到达目的港
    private Integer limitDay;


    //和申请表关联起来 1对1关系
    private Long feeidPending;


}
