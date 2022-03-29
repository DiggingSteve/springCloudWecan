package com.wecan.commonutils.commonClass.result;

import com.wecan.commonutils.commonEnum.ResultCodeEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
/**
 * 公共返回值
 */
public class ReturnResult implements Serializable {

    private Boolean resultsuccess;

    private Integer resultstatus;

    private String resultmessage;

    private Object resultdata;

    public ReturnResult() {
    }

    public static ReturnResult success() {
        ReturnResult returnResult = new ReturnResult();
        returnResult.setResultsuccess(ResultCodeEnum.Success.getBool());
        returnResult.setResultstatus(ResultCodeEnum.Success.getCode());
        returnResult.setResultmessage(ResultCodeEnum.Success.getMessage());
        return returnResult;
    }


    public static ReturnResult error() {
        ReturnResult returnResult = new ReturnResult();
        returnResult.setResultsuccess(ResultCodeEnum.Error.getBool());
        returnResult.setResultstatus(ResultCodeEnum.Error.getCode());
        returnResult.setResultmessage(ResultCodeEnum.Error.getMessage());
        return returnResult;
    }

    /**
     * 更改message信息
     *
     * @param message
     * @return
     */
    public ReturnResult changeMessage(String message) {
        this.resultmessage = message;
        return this;
    }

    /**
     * 新增message信息自动+“,” 添加到string后方
     *
     * @param message
     * @return
     */
    public ReturnResult putMessage(String message) {
        this.resultmessage += String.join("", ",", message);
        return this;
    }

    /**
     * 替换data中的信息
     *
     * @param data
     * @return
     */
    public ReturnResult changeData(Object data) {
        this.resultdata = data;
        return this;
    }

    /**
     * 添加返回值中data数据Key/value方式
     *
     * @param key
     * @param value
     * @return
     */
    public ReturnResult putData(String key, Object value) {
        Map<String, Object> putData = new HashMap<>();
        if (this.resultdata != null && this.resultdata instanceof HashMap) {
            putData = (Map<String, Object>) this.resultdata;
        }
        putData.put(key, value);
        this.resultdata = putData;
        return this;
    }

    public Object getDataByKey(String key) {
        Map<String, Object> putData = new HashMap<>();
        if (this.resultdata != null && this.resultdata instanceof HashMap) {
            putData = (Map<String, Object>) this.resultdata;
        }
        return putData.get(key);
    }

    /**
     * 添加返回值中data数据Map数据方式
     *
     * @param data
     * @return
     */
    public ReturnResult putData(Map<String, Object> data) {
        Map<String, Object> putData = new HashMap<>();
        if (this.resultdata != null && this.resultdata instanceof HashMap) {
            putData = (Map<String, Object>) this.resultdata;
        }
        putData.putAll(data);
        this.resultdata = putData;
        return this;
    }
}

