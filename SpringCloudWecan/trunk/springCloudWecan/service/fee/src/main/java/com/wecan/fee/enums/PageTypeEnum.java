package com.wecan.fee.enums;

public enum PageTypeEnum {
    normal("普通应收运费维护"),
    customer("客户应收运费维护");

    PageTypeEnum(String code){
        this.code=code;
    }

    private final String code;

    public String getCode(){
        return  code;
    }
}
