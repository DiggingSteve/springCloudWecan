/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/2 10:32
 */
package com.wecan.modelview.model.vo.fee.output;

import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class OutputCodeDiff extends InputCodeDiff {
    // 对应code的值
    public BigDecimal codeNum;

    public BigDecimal getCodeNum() {
        if(code.indexOf("kg")>-1){
            return new BigDecimal( code.replace("kg",""));
        }
        else return null;
    }

    public Long feeid;


}
