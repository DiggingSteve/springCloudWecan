/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/10 14:59
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InputBaseVo {

    public  String czman;

    public String dom;

    public String area;

    public LocalDateTime cztime;

    public  String logExtraData;


}
