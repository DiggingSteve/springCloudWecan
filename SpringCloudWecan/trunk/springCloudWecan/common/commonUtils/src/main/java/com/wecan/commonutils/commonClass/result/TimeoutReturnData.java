package com.wecan.commonutils.commonClass.result;

import java.util.HashMap;
import java.util.Map;

/**
 * 超时返回值
 */
public class TimeoutReturnData {
    public static ReturnResult fallBack() {
        return ReturnResult.error().changeMessage("服务异常[降级操作]");
    }
}
