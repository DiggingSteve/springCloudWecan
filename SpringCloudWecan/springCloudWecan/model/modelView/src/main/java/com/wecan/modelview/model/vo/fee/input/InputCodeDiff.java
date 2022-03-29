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

    // 是否默认选中的值 航司部分不需要传
    public  Integer isDefault;

}
