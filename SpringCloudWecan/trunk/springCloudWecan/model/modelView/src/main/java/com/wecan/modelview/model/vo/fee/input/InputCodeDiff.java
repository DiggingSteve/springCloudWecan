/**
 * @description: 运价系统费用新增页面不同code 产生的diff差价
 * @author: yaodui
 * @time: 2021/5/10 16:06
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;

import javax.persistence.Convert;
import java.math.BigDecimal;

@Data
public class InputCodeDiff {


    public String code;

    public String twocode;

    private BigDecimal diff;

    public BigDecimal getDiff(){
        return diff==null? BigDecimal.valueOf(0):diff;
    }

    // 是否基准值 在基准值上累加
    public  Boolean isDefault;

    public  Boolean isAdd;

    //是否设置了值
    public Boolean isSetValue;

    public Boolean isSameAsBase;

    // 现在标准价格填在 重量上面
    public BigDecimal standardPrice;

}
