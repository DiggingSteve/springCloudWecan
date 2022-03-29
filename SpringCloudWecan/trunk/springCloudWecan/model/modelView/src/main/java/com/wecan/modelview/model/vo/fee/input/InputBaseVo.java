/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/10 14:59
 */
package com.wecan.modelview.model.vo.fee.input;

import lombok.Data;
import net.bytebuddy.asm.Advice;

import java.time.LocalDateTime;

@Data
public class InputBaseVo {

    public  String czman;

    public String dom;

    public String area;

    private LocalDateTime cztime;

    public LocalDateTime getCztime(){
        return LocalDateTime.now();
    }

    public  String logExtraData;


}
