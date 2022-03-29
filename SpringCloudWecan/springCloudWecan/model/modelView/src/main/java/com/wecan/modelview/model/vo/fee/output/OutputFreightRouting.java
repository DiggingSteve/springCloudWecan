/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/27 13:58
 */
package com.wecan.modelview.model.vo.fee.output;

import com.wecan.modeldbo.airfreight.fee.FixedFreightFee;
import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import com.wecan.modelview.model.vo.fee.view.ViewFreightRouting;
import lombok.Data;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

@Data
public class OutputFreightRouting extends ViewFreightRouting {

    //是否存在卡车段
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
    private Integer realgid;

    private String wecanStandard;

    public String getWecanStandard(){
        return this.getGid()>0?"客户标准":"唯凯标准";
    }


    public Integer getRealgid(){
        return this.getGid();
    }


    //记录包装类型和
    public HashMap <String, BigDecimal>packageCusDiffMap=new HashMap<>();

    public Long truckFeeid;


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




}
