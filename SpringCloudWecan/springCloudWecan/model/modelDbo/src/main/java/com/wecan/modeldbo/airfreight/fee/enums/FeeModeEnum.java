/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/21 14:20
 */
package com.wecan.modeldbo.airfreight.fee.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;


@Getter
public enum FeeModeEnum implements IMapStructBaseEnum {

    EqualDirect(1,"随直达价"),

    Fixed(2,"固定价格");

    FeeModeEnum(int code, String des) {
        this.feeMode=code;
        this.des=des;
    }
    // my-batis plus 的枚举标识值
    @EnumValue
    private  final int feeMode;

    private final String des;

    @Override
    @JsonValue
    public Integer getCode() {
        return feeMode;
    }



}
