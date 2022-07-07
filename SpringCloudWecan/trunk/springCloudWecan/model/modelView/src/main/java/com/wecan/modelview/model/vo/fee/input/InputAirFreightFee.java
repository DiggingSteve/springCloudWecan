/**
 * @description: 运价新增编辑的View Model
 * @author: yaodui
 * @time: 2021/5/10 14:48
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InputAirFreightFee extends InputBaseVo {

    public InputAirFreightFee(){

    }

    private Long feeid;

    /**
     * 始发港
     */
    @NotNull(groups = {Insert.class},message = "始发港必填")
    private String sfg;

    /**
     * 目的港
     */
    @NotNull(groups = {Insert.class},message = "目的港必填")
    private String mdg;

    /**
     * 中转港 直达填''
     */
    private String zzg;

    /**
     * 开始时间
     */
    @NotNull(groups = {Insert.class},message = "开始时间必填")
    private LocalDateTime startdate;

    /**
     * 结束时间
     */
    @NotNull(groups = {Insert.class},message = "结束时间必填")
    private LocalDateTime enddate;

    private LocalDateTime addtime;





    private  Integer wffAreaid;

    private String remark;

    public void setRemark( String val){
        this.remark=val;
    }

    public String getRemark(){
        return this.remark.trim();
    }

    private  String jfType;

    private Integer gid;

    private String twocode;

    private String threeCodeStr;

    private String hbh;

    //是否含战争附加费

    private Boolean isContainWar;
    //是否含燃油附加费

    private Boolean isContainGas;
    //是否含地面货站费

    private Boolean isContainStation;

    private Boolean isSpecifiedFlight;

    //清关后多久到达目的港
    private Integer limitDay;


    /**
    * 航司价格参数
    * */
    public List<InputCodeDiff> aircomArr;

    /**
     * 包装类型价格参数
     * */
    public List<InputCodeDiff> packageTypeArr;

    /**
     * 重量等级价格参数
     * */
    public List<InputCodeDiff> weightArr;

    public List<InputCodeDiff>cargoArr;

    /**
     * 货型参数 （一种体积比）
     * */
    public List<InputCodeDiff> volRatioArr;

    /**
     * 客户类型
     * **/
    public  List<InputCodeDiff>cusLevelArr;

    //
    public List<InputFixedFreightFee>fixedPriceArr;

    public List<InputFeeAirFlight> flightArr;



}
