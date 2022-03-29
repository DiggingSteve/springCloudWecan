package com.wecan.modeldbo.airfreight.fee.enums;

public enum ApprovalStatusEnum implements IMapStructBaseEnum {
    PendingApproval(100,"待审核"),
    Approval(200,"已通过"),
    Reject(500,"已驳回");


    private ApprovalStatusEnum(int code, String des) {
        this.code=code;
        this.des=des;
    }

    private int code;

    private String des;


    @Override
    public Integer getCode() {
        return this.code;
    }
}
