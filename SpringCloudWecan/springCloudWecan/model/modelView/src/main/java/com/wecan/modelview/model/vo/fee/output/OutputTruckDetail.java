/**
 * @description:
 * @author: yaodui
 * @time: 2021/10/28 15:00
 */
package com.wecan.modelview.model.vo.fee.output;

import com.wecan.modeldbo.airfreight.fee.TruckFee;
import com.wecan.modeldbo.airfreight.fee.TruckFeeWeight;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class OutputTruckDetail {
    public OutputTruckDetail(){
        this.codeArr=new ArrayList<>();
    }
    public TruckFee fee;

    public List<TruckFeeWeight>codeArr;
}
