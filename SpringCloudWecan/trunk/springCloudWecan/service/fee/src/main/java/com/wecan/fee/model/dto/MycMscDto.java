/**
 * @description:
 * @author: yaodui
 * @time: 2021/12/2 15:27
 */
package com.wecan.fee.model.dto;

import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Date;

@Data
// 获取myc msc 数据所需要的的dto
public class MycMscDto {
    public String area;

    public String mdg;

    public String sfg;

    public String threeCode;

    private String hbrq;

    private Long feeid;

    public String getHbrq(){
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");//设置日期格式
        return df.format(new Date());
    }
}
