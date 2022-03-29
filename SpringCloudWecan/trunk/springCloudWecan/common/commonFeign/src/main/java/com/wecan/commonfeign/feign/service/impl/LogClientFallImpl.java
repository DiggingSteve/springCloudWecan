package com.wecan.commonfeign.feign.service.impl;

import com.wecan.commonfeign.feign.service.LogClientService;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.logger.LogData;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/**
 * feign触发熔断后的返回值重写方法
 */
@Component
public class LogClientFallImpl implements LogClientService {
    @Override
    public ReturnResult insertLogData(LogData logData) {
        return ReturnResult.error().changeMessage("LogClientFallImpl");
    }
//
//    @Service
//    public static class LogClientImpl {
//        private static LogClientService logClientService;
//
//        @Autowired
//        public void setLogClientService(LogClientService logClientService) {
//            this.logClientService = logClientService;
//        }
//
//        public static ReturnResult insertLogData(LogData logData) {
//            try {
//                var resultData = logClientService.insertLogData(logData);
//                return resultData;
//            } catch (Exception e) {
//                return ReturnResult.error();
//            }
//        }
//    }
}
