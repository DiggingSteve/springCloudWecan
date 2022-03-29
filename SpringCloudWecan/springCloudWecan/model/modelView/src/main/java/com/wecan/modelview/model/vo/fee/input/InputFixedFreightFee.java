/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/17 16:19
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;

import javax.persistence.Column;
import java.math.BigDecimal;
@Data
public class InputFixedFreightFee {
    private Long feeid;


    public BigDecimal diff;


    public String cus;


    public String packageType;


    public  String vol;



    public String weight;

}
