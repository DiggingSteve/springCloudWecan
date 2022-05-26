/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/27 13:58
 */
package com.wecan.modelview.model.vo.fee.output;

import com.wecan.modeldbo.airfreight.fee.FeeAirFlight;
import com.wecan.modeldbo.airfreight.fee.FixedFreightFee;
import com.wecan.modeldbo.airfreight.fee.TruckFeeWeight;
import com.wecan.modelview.model.vo.fee.view.ViewFreightRouting;
import lombok.Data;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

@Data
public class OutputFreightRouting extends ViewFreightRouting {

    //是否存在卡车段 卡车段需要等于查询目的地才显示
    private Boolean hasTruckRouting;

    public Boolean getHasTruckRouting(){

        return this.getDdg()!=null&&this.getTruckTwocode()!=null&& !this.getDdg().isEmpty() && !this.getTruckTwocode().isEmpty();
    }

    private String term;

    //是否精确查询
    private Boolean isExactSearch=false;

    public String getTerm(){
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        term = df.format(this.getStartDate()) + "至" + df.format(this.getEndDate());
        return term;
    }

    public String getEnddate(){
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return df.format(super.getEndDate());
    }

    private Integer realgid;

    private String wecanStandard;

    public String getWecanStandard(){
        return this.getGid()>0?"客户报价":"公布运价";
    }


    public Integer getRealgid(){
        return this.getGid();
    }


    //记录包装类型和
    public HashMap <String, BigDecimal>packageCusDiffMap=new HashMap<>();

    public Long truckFeeid;

    public String packageType;

    /**
     * 重量等级价格参数
     * */
    public List<OutputCodeDiff> weightArr;

    /**
     * 货型参数 （一种体积比）
     * */
    public List<OutputCodeDiff> volArr;

    public List<OutputCodeDiff> cusArr;

    public List<OutputCodeDiff> packageTypeArr;

    public List<FixedFreightFee>fixedFeeList;

    public List<TruckFeeWeight> truckFeeWeightList;

    public List<FeeAirFlight>flightList;



}
