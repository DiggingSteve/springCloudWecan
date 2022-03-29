package com.wecan.commonutils.commonEnum;

/**
 * ResultCode枚举
 */
public enum ResultCodeEnum {

    Success(true, 0, "success"), Error(false, 100, "error");
    // 成员变量
    private Boolean bool;
    private Integer code;
    private String message;

    // 构造方法
    private ResultCodeEnum(Boolean bool, Integer code, String message) {
        this.bool = bool;
        this.code = code;
        this.message = message;
    }

    public Boolean getBool() {
        return bool;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
