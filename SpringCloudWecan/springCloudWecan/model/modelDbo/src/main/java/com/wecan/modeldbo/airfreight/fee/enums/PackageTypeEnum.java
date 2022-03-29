/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/24 14:58
 */
package com.wecan.modeldbo.airfreight.fee.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PackageTypeEnum implements IMapStructBaseEnum{

    sanhuo("散货","散货"),

    tuopan("托盘","托盘");

    PackageTypeEnum(String code, String des) {
        this.strCode=code;
        this.des=des;
    }
    // my-batis plus 的枚举标识值
    @EnumValue
    private  final String strCode;

    private final String des;

    @Override
    @JsonValue
    public String getStrCode() {
        return strCode;
    }
}
