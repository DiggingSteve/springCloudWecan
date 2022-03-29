/**
 * @description:
 * @author: yaodui
 * @time: 2021/12/2 17:20
 */
package com.wecan.fee.model.dto;

import java.math.BigDecimal;

//接收myc接口返回值
public class MycResultDto {
    public String itemsename;

    public BigDecimal price;

    public BigDecimal min_price;
}
